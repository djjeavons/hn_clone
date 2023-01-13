const db = require("./db");

async function getItem(itemId) {
  try {
    const result = await db.query(
      `SELECT 
        id, deleted, type, by, text, dead, parent, url, score, title, descendants, time 
    FROM 
        "Items" 
    WHERE 
        id = $1`,
      [itemId]
    );

    if (result && result.rows.length > 0) {
      return {
        id: result.rows[0].id,
        deleted: result.rows[0].deleted,
        type: result.rows[0].type == null ? "" : result.rows[0].type.trim(),
        by: result.rows[0].by == null ? "" : result.rows[0].by.trim(),
        text: result.rows[0].text == null ? "" : result.rows[0].text.trim(),
        dead: result.rows[0].dead,
        parent: result.rows[0].parent,
        url: result.rows[0].url,
        score: result.rows[0].score,
        title: result.rows[0].title == null ? "" : result.rows[0].title.trim(),
        descendants: result.rows[0].descendants,
        time: result.rows[0].time,
        // Comments
        comments: await getComments(itemId),
      };
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
}

async function getComments(itemId) {
  try {
    const result = await db.query(
      `select  id
        ,by
        ,parentid
        ,text
        ,"time"
        ,type
        ,parenttype
        from "Comments" 
        where parentid = $1`,
      [itemId]
    );

    if (result && result.rows.length > 0) {
      const comments = result.rows.map((record) => {
        return {
          id: record.id,
          by: record.by != null ? record.by.trim() : "",
          parentId: record.parentid,
          text: record.text != null ? record.text.trim() : "",
          time: record.time,
          type: record.type,
          parentType: record.parenttype,
          comments: getComments(record.id),
        };
      });

      return comments;
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
}

exports.getItem = getItem;
