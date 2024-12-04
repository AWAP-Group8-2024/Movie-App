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

export const getToken = async (user) => {
  const payload = { id: user.id, email: user.email };
  const token = sign(payload, process.env.JWT_SECRET);
  return token;
};

export const insertTestUser = async (user) => {
  try {
    const hashedPassword = await hash(user.password, 10);
    await pool.query("INSERT INTO account (email, password) VALUES ($1, $2)", [
      user.email,
      hashedPassword,
    ]);
  } catch (error) {
    console.error("Error inserting test user:", error);
    throw error;
  }
};
