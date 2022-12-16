/* 
1. Obtain list of top stories
    1.1. For each id obtain item
2. Check if item already exists and if it does update record otherwise create record

Repeat for best stories, new stories, shows, asks etc.
*/
import fetch from "node-fetch";
import { SaveItem } from "./lib/db.js";

const rootUri = "https://hacker-news.firebaseio.com/v0";

const topStoryData = await fetchData(`${rootUri}/topstories.json`);

if (topStoryData) {
  topStoryData.map((e, index) => {
    if (index <= 10) {
      fetchItem(e).then(async (data) => {
        // Insert or update the story
        await SaveItem(data);
        //console.log(data);
      });
    }
  });
}

// Simply returns the response data from the request
async function fetchData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();

    return data;
  } catch (error) {
    throw error;
  }
}

// Returns an individual item
async function fetchItem(id) {
  try {
    const response = await fetch(`${rootUri}/item/${id}.json`);
    const data = await response.json();

    return data;
  } catch (error) {
    throw error;
  }
}
