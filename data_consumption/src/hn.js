#!/usr/bin/env node
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const chalk = require("chalk");
const { Command, Option } = require("commander");
const api = require("./lib/api");
const item = require("./lib/dal/item");
const comment = require("./lib/dal/comment");
const logger = require("./lib/logger");

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
        "job",
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
          await refreshItem(itemToRefresh);
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

        await getItems(type, latest);
        break;
    }
  }
}

async function refreshItem(itemId) {
  log(chalk.blueBright(`=> Refreshing item ${itemId}`));

  let result = 0;
  let data = {};

  try {
    data = await api.fetchItem(itemId);
    result = await item.saveItem(data);
  } catch (err) {
    log(chalk.redBright(`Error: ${err.message}`));
  }

  if (result === 0) {
    log(chalk.redBright(`${itemId} not found`));
  } else {
    log(chalk.yellow(`Refreshing comments for ${itemId}`));
    await processComments(data.type, data);
    log(chalk.blueBright(`=> Item refreshed`));
  }
}

async function getItems(type, latest) {
  log(
    chalk.blueBright(
      `=> Start processing ${type} stories (latest set to ${latest})`
    )
  );
  logger.logToFile(
    `Start processing ${type} stories (latest set to ${latest})`
  );

  let url = "";
  let typeToFilter = "story";

  switch (type) {
    case "top":
      url = process.env.HN_TOP_STORIES_URL;
      break;
    case "best":
      url = process.env.HN_BEST_STORIES_URL;
      break;
    case "new":
      url = process.env.HN_NEW_STORIES_URL;
      break;
    case "ask":
      url = process.env.HN_ASK_STORIES_URL;
      typeToFilter = "ask";
      break;
    case "show":
      url = process.env.HN_SHOW_STORIES_URL;
      typeToFilter = "show";
      break;
    case "job":
      url = process.env.HN_JOB_STORIES_URL;
      typeToFilter = "job";
      break;
    default:
      break;
  }

  let originalList = [];

  try {
    originalList = await api.fetchData(url);
  } catch (err) {
    log(chalk.redBright(`Error getting items from ${url}: ${err.message}`));
    logger.logToFile(`Error getting items from ${url}: ${err.message}`);
    return;
  }

  let finalList = [];

  if (latest) {
    const maxItemId = await item.itemMax(typeToFilter);

    if (isNaN(maxItemId) || maxItemId === 0) {
      log(
        chalk.redBright(
          `Error: No records exist for ${type}. Try again without the -l argument`
        )
      );
      logger.logToFile(
        `Error: No records exist for ${type}. Try again without the -l argument`
      );
      return;
    }

    finalList = originalList.filter((id) => id > maxItemId);
  } else {
    finalList = originalList;
  }

  if (finalList.length === 0) {
    log(chalk.redBright(`No items to process for ${type} stories`));
    logger.logToFile(`No items to process for ${type} stories`);
    return;
  }

  await processItems(finalList, typeToFilter);
}

async function processItems(items, type) {
  log(
    chalk.blueBright(`=> Processing (${items.length.toString()} items) stories`)
  );
  logger.logToFile(`Processing (${items.length.toString()} items) stories`);

  for (let i = 0; i < items.length; i++) {
    log(
      chalk.yellow(
        `Processing ${(
          i + 1
        ).toString()} of ${items.length.toString()} ${type} stories`
      )
    );
    logger.logToFile(
      `Processing ${(
        i + 1
      ).toString()} of ${items.length.toString()} ${type} stories`
    );

    let currentStory = {};

    try {
      currentStory = await api.fetchItem(items[i]);
      if (currentStory) {
        await item.saveItem(currentStory);
      }
    } catch (error) {
      log(
        chalk.red(
          `Error fetching and saving item ${items[i].id}: ${error.message}`
        )
      );
      logger.logToFile(
        `Error fetching and saving item ${items[i].id}: ${error.message}`
      );
    }

    log(chalk.green(`==> Processing comments...`));
    logger.logToFile(`Processing comments...`);

    await processComments(type, currentStory);
  }

  log(chalk.blueBright(`=> Completed processing ${type} stories`));
  logger.logToFile(`Completed processing ${type} stories`);
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
      logger.logToFile(`Error fetching comment: ${error.message}`);
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
