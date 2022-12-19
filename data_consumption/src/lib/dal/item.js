const db = require("./db");

async function saveItem(itemData) {
  let result = 0;

  if (!itemData) {
    return result;
  }

  if ((await itemExists(itemData.id)) === true) {
    result = await updateItem(itemData);
  } else {
    result = await createItem(itemData);
  }

  return result;
}

async function itemExists(itemId) {
  const result = await db.query(
    'SELECT COUNT(id) As "rowCount" FROM "Items" WHERE id = $1',
    [itemId]
  );

  if (result.rows[0] && parseInt(result.rows[0].rowCount) === 1) {
    return true;
  } else {
    return false;
  }
}

async function itemMax(type) {
  const result = await db.query(
    'SELECT Max(id) As "MaxId" FROM "Items" WHERE type=$1',
    [type]
  );

  let maxId = 0;

  if (result.rows[0]) {
    try {
      maxId = parseInt(result.rows[0].MaxId);
    } catch (err) {} // Do nothing, return 0
  }

  return maxId;
}

async function totalItems() {
  const result = await db.query(
    'SELECT COUNT(id) As "totalItems" FROM "Items"'
  );

  let total = 0;

  if (result.rows[0]) {
    try {
      total = parseInt(result.rows[0].totalItems);
    } catch (err) {} // Do nothing, return 0
  }

  return total;
}

async function totalComments() {
  const result = await db.query(
    'SELECT COUNT(id) As "totalComments" FROM "Comments"'
  );

  let total = 0;

  if (result.rows[0]) {
    try {
      total = parseInt(result.rows[0].totalComments);
    } catch (err) {} // Do nothing, return 0
  }

  return total;
}

async function getTotals() {
  const totals = {
    items: await totalItems(),
    comments: await totalComments(),
  };
  return totals;
}

async function updateItem(itemData) {
  const updateStatement =
    'UPDATE "Items" SET deleted = $2, type = $3, by = $4, time = $5, text = $6, dead = $7, parent = $8, url = $9, score = $10, title = $11, descendants = $12 WHERE id = $1';

  return await executeStatement(updateStatement, itemData);
}

async function createItem(itemData) {
  const insertStatement =
    'INSERT INTO "Items" (id, deleted, type, by, time, text, dead, parent, url, score, title, descendants) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)';

  return await executeStatement(insertStatement, itemData);
}

async function executeStatement(statement, itemData) {
  const parameters = [
    itemData.id,
    itemData.deleted,
    itemData.type,
    itemData.by,
    itemData.time,
    itemData.text,
    itemData.dead,
    itemData.parent,
    itemData.url,
    itemData.score,
    itemData.title,
    itemData.descendants,
  ];

  const result = await db.query(statement, parameters);
  return result.rowCount;
}

exports.saveItem = saveItem;
exports.itemMax = itemMax;
exports.getTotals = getTotals;
