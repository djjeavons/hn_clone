import pg from "pg";

// Connection information for Postgres - ToDo: create environment variables for these values.
const connectionConfig = {
  user: "djeavons",
  password: "H3tf!eldM3tall!ca",
  host: "192.168.0.59",
  port: 5432,
  database: "HackerNews",
};

const pool = new pg.Pool(connectionConfig);

// Saves an item to the database - ToDo: Need to add checks for update or insert. So refactor
// to two methods. Need to also consider where data will be saved (Stories, Ask, Show, Comments etc.)
export async function SaveItem(itemData) {
  const client = await pool.connect();
  let result = 0;

  try {
    const insertStatement =
      'INSERT INTO "Stories" (id, deleted, type, by, time, text, dead, parent, url, score, title, descendants) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)';
    const insertValues = [
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

    await client.query("BEGIN");
    result = await client.query(insertStatement, insertValues);
    await client.query("COMMIT");
  } catch (error) {
    client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
    return result;
  }
}
