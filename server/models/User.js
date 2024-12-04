import { pool } from "../helpers/db.js";

export const insertUser = async (email, hashedPassword) => {
  console.log("hashedPassword: ", hashedPassword);
  try {
    const result = await pool.query(
      "INSERT INTO account (email,password) values ($1,$2) returning *",
      [email, hashedPassword]
    );
    return result;
  } catch (error) {
    return next(new ApiError("Server error while database queries", 500));
  }
};

export const searchUserByEmail = async (email) => {
  try {
    const result = await pool.query("SELECT * FROM account WHERE email = $1", [
      email,
    ]);
    return result;
  } catch (error) {
    console.log("Database query error:", error);
    return next(new ApiError("Server error while database queries", 500));
  }
};

export const searchUserById = async (id) => {
  try {
    const result = await pool.query("SELECT * FROM account WHERE id = $1", [
      id,
    ]);
    return result;
  } catch (error) {
    return next(new ApiError("Server error while database queries", 500));
  }
};

export const deleteUserById = async (id) => {
  try {
    const result = await pool.query("DELETE FROM account WHERE id = $1", [id]);
    return result;
  } catch (error) {
    return next(new ApiError("Server error while database queries", 500));
  }
};

export const getGroupPendingRequestsById = async (id) => {
  try {
    const result = await pool.query(
      "SELECT * FROM join_requests WHERE account_id = $1 AND status = 'pending'",
      [id]
    );
    return result.rows;
  } catch (error) {
    return next(new ApiError("Server error while database queries", 500));
  }
};

export const isEmailExisting = async (email) => {
  try {
    const emailCheck = await pool.query(
      "SELECT id FROM account WHERE email = $1",
      [email]
    );
    return emailCheck.rowCount > 0;
  } catch (error) {
    return next(new ApiError("Server error while database queries", 500));
  }
};

export const updateUserById = async (id, updateInfo) => {
  try {
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

    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    return next(new ApiError("Server error while database queries", 500));
  }
};
