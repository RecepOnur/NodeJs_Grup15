const { Pool } = require("pg");
const dotenv = require("dotenv");
const fs = require("fs");

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});
const schema = fs.readFileSync("schema.sql", "utf8");

try {
  pool.connect((err, client, release) => {
    if (err) {
      return console.error("Error acquiring client", err.stack);
    }
    console.log("Connected to PostgreSQL database");
    // try {
    //   client.query(schema, (err, result) => {
    //     release();
    //     if (err) {
    //       return console.error("Error executing query", err.stack);
    //     }
    //     console.log(
    //       "Current date and time from PostgreSQL:",
    //       result.rows[0].now
    //     );
    //   });
    // } catch (error) {}
  });
} catch (error) {}
module.exports = {
  query: (text, params) => {
    return pool.query(text, params);
  },
};
