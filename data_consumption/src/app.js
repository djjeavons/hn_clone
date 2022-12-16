const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const api = require("./lib/api");
const story = require("./lib/dal/story");

main();

// Entry point to the application. Allows for async/await
async function main() {
  const topStoriesList = await api.fetchData(process.env.HN_TOP_STORIES_URL);

  if (topStoriesList) {
    topStoriesList.map(async (e) => {
      story.saveStory(await api.fetchItem(e));
    });
  }
}
