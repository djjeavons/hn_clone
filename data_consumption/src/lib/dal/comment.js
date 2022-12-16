const db = require("./db");

async function saveComment(commentData, parentType) {
  let result = 0;

  if (!commentData) {
    return result;
  }

  if ((await commentExists(commentData.id)) === true) {
    result = await updateComment(commentData, parentType);
  } else {
    result = await createComment(commentData, parentType);
  }

  return result;
}

async function commentExists(commentId) {
  const result = await db.query(
    'SELECT COUNT(id) As "rowCount" FROM "Comments" WHERE id = $1',
    [commentId]
  );

  if (result.rows[0] && parseInt(result.rows[0].rowCount) === 1) {
    return true;
  } else {
    return false;
  }
}

async function updateComment(commentData, parentType) {
  const updateStatement =
    'UPDATE "Comments" SET by = $2, parentId = $3, text = $4, time = $5, type = $6, parentType = $7 WHERE id = $1';

  return await executeStatement(updateStatement, commentData, parentType);
}

async function createComment(commentData, parentType) {
  const insertStatement =
    'INSERT INTO "Comments" (id, by, parentId, text, time, type, parenttype) VALUES ($1, $2, $3, $4, $5, $6, $7)';

  return await executeStatement(insertStatement, commentData, parentType);
}

async function executeStatement(statement, commentData, parentType) {
  const parameters = [
    commentData.id,
    commentData.by,
    commentData.parent,
    commentData.text,
    commentData.time,
    commentData.type,
    parentType,
  ];

  const result = await db.query(statement, parameters);
  return result.rowCount;
}

exports.saveComment = saveComment;
