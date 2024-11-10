import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();
const env = process.env.NODE_ENV;

const { Pool } = pkg;

const openDb = () => {
  const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    // env === "development" ? process.env.DB_NAME : process.env.TESTDB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });
  return pool;
};
const pool = openDb();
console.log("Database connected");
console.log("Environment:", env);
console.log("Database:", process.env.DB_NAME);
console.log("Password:", process.env.DB_PASSWORD);
export { pool };
