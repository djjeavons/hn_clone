#!/usr/bin/env node
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const chalk = require("chalk");
const { Command, Option } = require("commander");
const api = require("./lib/api");
const story = require("./lib/dal/story");
const comment = require("./lib/dal/comment");

const log = console.log;
const program = new Command();

main();

// Entry point to the application. Allows for async/await
async function main() {
  program
    .name("Hacker News (HN) Data Consumption")
    .description(
      "Gets data via the HN API and stores that data in a Postgresql database"
    )
    .version("0.0.1");

  program
    .command("get")
    .description(
      "Gets items (top stories, best stories, new stories etc.) from HN"
    )
    .addOption(
      new Option("-t, --type <type>", "Item type").choices([
        "top",
        "best",
        "new",
        "ask",
        "show",
        "ALL",
      ])
    )
    .addOption(
      new Option(
        "-l, --latest",
        "Gets items newer than the max item identifier stored in the database. If no type passed then will assume top stories"
      )
    );

  program.command("refresh <itemid>").description("Refreshes the item passed");

  program.parse();

  if (program.args.length > 0) {
    switch (program.args[0]) {
      case "refresh":
        if (isNaN(program.args[1])) {
          log(
            chalk.redBright("Error: Item Id to be refreshed must be a number")
          );
        } else {
          const itemToRefresh = parseInt(program.args[1]);
          // Do the refreshing call
          console.log(`Refresh the item: ${itemToRefresh}`);
        }
        break;

      case "get":
        // Ensure we have at least one flag (-t, -l)
        if (program.args.length === 1) {
          log(
            chalk.redBright(
              "Error: At least one argument must be supplied to get"
            )
          );
        }

        let type = "top";
        let latest = false;

        if (program.args.includes("-t")) {
          type = program.args[program.args.indexOf("-t") + 1];
        }

        if (program.args.includes("-l")) {
          latest = true;
        }

        // Do the get or latest get here
        console.log(`Get latest: ${latest} for type: ${type}`);
        break;
    }
  }
}

async function processTopStories() {
  log(chalk.yellow("Start processing top stories"));

  let topStoriesList = [];

  try {
    topStoriesList = await api.fetchData(process.env.HN_TOP_STORIES_URL);
  } catch (error) {
    log(chalk.red(`Error fetching top stories list: ${error.message}`));
    return;
  }

  log(chalk.blue(`Fetched ${topStoriesList.length.toString()} top stories.`));

  if (topStoriesList) {
    let index = 0;
    for (const item in topStoriesList) {
      index++;
      log(
        chalk.green(
          `Processing story ${index.toString()} of ${topStoriesList.length.toString()}`
        )
      );

      let currentStory = {};

      try {
        currentStory = await api.fetchItem(topStoriesList[item]);
        if (currentStory) {
          await story.saveStory(currentStory);
        }
      } catch (error) {
        log(
          chalk.red(
            `Error fetching item ${topStoriesList[item].id}: ${error.message}`
          )
        );
      }

      if (currentStory) {
        try {
        } catch (error) {
          log(chalk.red(`Error processing comment: ${error.message}`));
        }
        await processComments("Story", currentStory);
      }
    }
  }

  log(chalk.yellow("Completed processing top stories."));
}

async function processComments(parentType, itemData) {
  if (!itemData.kids) {
    return;
  }

  let currentComment = {};

  for (const commentIndex in itemData.kids) {
    try {
      currentComment = await api.fetchItem(itemData.kids[commentIndex]);
      if (currentComment) {
        await comment.saveComment(currentComment, parentType);
      }
    } catch (error) {
      log(chalk.red(`Error fetching comment: ${error.message}`));
    }

    if (
      currentComment &&
      currentComment.kids &&
      currentComment.kids.length > 0
    ) {
      await processComments("Comment", currentComment);
    }
  }
}

async function configureProgram() {}
