const { Pool } = require("pg");

const connectionConfig = {
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DATABASE,
};

const pool = new Pool(connectionConfig);

module.exports = {
  async query(text, params) {
    let client;
    let result;

    try {
      client = await pool.connect();
      result = await client.query(text, params);
    } catch (error) {
      throw error;
    } finally {
      client.release();
      return result;
    }
  },
};
