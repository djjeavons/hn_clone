const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const chalk = require("chalk");
const api = require("./lib/api");
const story = require("./lib/dal/story");
const comment = require("./lib/dal/comment");

const log = console.log;

main();

// Entry point to the application. Allows for async/await
async function main() {
  await processTopStories();
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
