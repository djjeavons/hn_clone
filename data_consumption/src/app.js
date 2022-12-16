const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const chalk = require("chalk");
const api = require("./lib/api");
const story = require("./lib/dal/story");
const comment = require("./lib/dal/comment");
const threadSleep = require("thread-sleep");

const log = console.log;

main();

// Entry point to the application. Allows for async/await
async function main() {
  log(chalk.yellow("Start processing top stories"));
  await processTopStories();
  log(chalk.yellow("Completed processing top stories."));
}

async function processTopStories() {
  let topStoriesList = [];

  try {
    topStoriesList = await api.fetchData(process.env.HN_TOP_STORIES_URL);
  } catch (error) {
    log(chalk.red(`Error fetching top stories list: ${error.message}`));
    return;
  }

  log(chalk.blue(`Fetched ${topStoriesList.length.toString()} top stories.`));

  if (topStoriesList) {
    topStoriesList.map(async (e, index) => {
      log(
        chalk.green(
          `Processing story ${index.toString()} of ${topStoriesList.length.toString()}`
        )
      );

      let currentStory = {};

      try {
        currentStory = await api.fetchItem(e);
        if (currentStory) {
          await story.saveStory(currentStory);
        }
      } catch (error) {
        log(chalk.red(`Error fetching item ${e.id}: ${error.message}`));
        threadSleep(2000);
      }

      if (currentStory) {
        try {
          log(
            chalk.blue(
              `Processing comments for story ${currentStory.id.toString()}`
            )
          );
        } catch (error) {}
        await processComments("Story", currentStory);
      }
    });
  }
}

async function processComments(parentType, itemData) {
  if (!itemData.kids) {
    return;
  }

  let currentComment = {};

  itemData.kids.map(async (e) => {
    try {
      currentComment = await api.fetchItem(e);
      if (currentComment) {
        await comment.saveComment(currentComment, parentType);
      }
    } catch (error) {
      log(chalk.red(`Error fetching comment ${e.id}: ${error.message}`));
      threadSleep(2000);
    }

    if (
      currentComment &&
      currentComment.kids &&
      currentComment.kids.length > 0
    ) {
      await processComments("Comment", currentComment);
    }
  });
}
