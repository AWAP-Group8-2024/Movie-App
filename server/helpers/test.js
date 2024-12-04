import fs from "fs";
import path from "path";
import { pool } from "./db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const { hash } = bcrypt;
const { sign } = jwt;

const __dirname = path.resolve();

export const initializeDB = async () => {
  const sqlPath = path.resolve(__dirname, "./db/init.sql");
  const sql = fs.readFileSync(sqlPath, "utf8");
  try {
    await pool.query(sql);
    console.log("   Initialized successfully");
  } catch (error) {
    console.error("Error initializing the database:", error);
    throw error;
  }
};
