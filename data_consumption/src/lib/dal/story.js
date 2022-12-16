const db = require("./db");

async function saveStory(storyData) {
  let result = 0;

  if (!storyData) {
    return result;
  }

  if (storyExists(storyData.id) === true) {
    result = await updateStory(storyData);
  } else {
    result = await createStory(storyData);
    console.log(`${result} -- ${storyData.title}`);
  }

  return result;
}

async function storyExists(storyId) {
  return false;
}

async function updateStory(storyData) {}

async function createStory(storyData) {
  const insertStatement =
    'INSERT INTO "Stories" (id, deleted, type, by, time, text, dead, parent, url, score, title, descendants) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)';
  const insertParameters = [
    storyData.id,
    storyData.deleted,
    storyData.type,
    storyData.by,
    storyData.time,
    storyData.text,
    storyData.dead,
    storyData.parent,
    storyData.url,
    storyData.score,
    storyData.title,
    storyData.descendants,
  ];

  const result = await db.query(insertStatement, insertParameters);

  return result.rowCount;
}

exports.saveStory = saveStory;
