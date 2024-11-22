import { pool } from "../helpers/db.js";

export const insertUser = async (email, hashedPassword) => {
  const result = await pool.query(
    "INSERT INTO account (email,password) values ($1,$2) returning *",
    [email, hashedPassword]
  );
  return result;
};

export const searchUserByEmail = async (email) => {
  const result = await pool.query("SELECT * FROM account WHERE email = $1", [
    email,
  ]);
  return result;
};

export const searchUserById = async (id) => {
  const result = await pool.query("SELECT * FROM account WHERE id = $1", [id]);
  return result;
};

export const deleteUserById = async (id) => {
  const result = await pool.query("DELETE FROM account WHERE id = $1", [id]);
  return result;
};

export const getGroupPendingRequestsById = async (id) => {
  const result = await pool.query(
    "SELECT * FROM join_requests WHERE account_id = $1 AND status = 'pending'",
    [id]
  );
  return result.rows;
};

export const isEmailExisting = async (email) => {
  const emailCheck = await pool.query(
    "SELECT id FROM account WHERE email = $1",
    [email]
  );
  return emailCheck.rowCount > 0;
};

export const updateUserById = async (id, updateInfo) => {
  const keys = Object.keys(updateInfo);
  const values = Object.values(updateInfo);

  const setClause = keys
    .map((key, index) => `${key} = $${index + 1}`)
    .join(", ");

  values.push(id);

  const query = `
    UPDATE account
    SET ${setClause}
    WHERE id = $${keys.length + 1}
    RETURNING *;
  `;

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("Error in user model:", error);
    throw error;
  }
};
