const fetch = require("node-fetch");

async function fetchData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();

    return data;
  } catch (error) {
    throw error;
  }
}

async function fetchItem(id) {
  try {
    const response = await fetch(`${process.env.HN_ITEM_ROOT_URL}/${id}.json`);
    const data = await response.json();

    return data;
  } catch (error) {
    throw error;
  }
}

exports.fetchData = fetchData;
exports.fetchItem = fetchItem;
