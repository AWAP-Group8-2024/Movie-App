import { pool } from "../helpers/db.js";

const insertUser = async (email, hashedPassword) => {
  const result = await pool.query(
    "INSERT INTO account (email,password) values ($1,$2) returning *",
    [email, hashedPassword]
  );
  return result;
};

const searchUserByEmail = async (email) => {
  const result = await pool.query("SELECT * FROM account WHERE email = $1", [
    email,
  ]);
  return result;
};

const searchUserById = async (id) => {
  const result = await pool.query("SELECT * FROM account WHERE id = $1", [id]);
  return result;
};

const deleteUserById = async (id) => {
  const result = await pool.query("DELETE FROM account WHERE id = $1", [id]);
  return result;
};

const isEmailExisting = async (email) => {
  const emailCheck = await pool.query(
    "SELECT id FROM account WHERE email = $1",
    [email]
  );
  return emailCheck.rowCount > 0;
};

export {
  insertUser,
  searchUserByEmail,
  searchUserById,
  deleteUserById,
  isEmailExisting,
};
