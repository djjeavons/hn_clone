const db = require("./db");

async function saveStory(storyData) {
  let result = 0;

  if (!storyData) {
    return result;
  }

  if ((await storyExists(storyData.id)) === true) {
    result = await updateStory(storyData);
  } else {
    result = await createStory(storyData);
  }

  return result;
}

async function storyExists(storyId) {
  const result = await db.query(
    'SELECT COUNT(id) As "rowCount" FROM "Stories" WHERE id = $1',
    [storyId]
  );

  if (result.rows[0] && parseInt(result.rows[0].rowCount) === 1) {
    return true;
  } else {
    return false;
  }
}

async function updateStory(storyData) {
  const updateStatement =
    'UPDATE "Stories" SET deleted = $2, type = $3, by = $4, time = $5, text = $6, dead = $7, parent = $8, url = $9, score = $10, title = $11, descendants = $12 WHERE id = $1';

  return await executeStatement(updateStatement, storyData);
}

async function createStory(storyData) {
  const insertStatement =
    'INSERT INTO "Stories" (id, deleted, type, by, time, text, dead, parent, url, score, title, descendants) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)';

  return await executeStatement(insertStatement, storyData);
}

async function executeStatement(statement, storyData) {
  const parameters = [
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

  const result = await db.query(statement, parameters);
  return result.rowCount;
}

exports.saveStory = saveStory;
