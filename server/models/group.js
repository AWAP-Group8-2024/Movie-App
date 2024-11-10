// ../models/group.js
import { pool } from "../helpers/db.js";

const createGroup = async (name, description) => {
  const result = await pool.query(
    `INSERT INTO groups (name, description) VALUES ($1, $2) RETURNING *`,
    [name, description]
  );
  return result;
};

const listGroups = async () => {
  const groups = await pool.query(`SELECT * FROM groups`);
  return groups.rows;
};

const getGroup = async (id) => {
  const group = await pool.query(`SELECT * FROM groups WHERE id = $1`, [id]);
  return group.rows[0];
};

const updateGroup = async (id, name, description) => {
  const result = await pool.query(
    `UPDATE groups SET name = $1, description = $2 WHERE id = $3 RETURNING *`,
    [name, description, id]
  );
  return result.rows[0];
};

const deleteGroup = async (id) => {
  await pool.query(`DELETE FROM groups WHERE id = $1`, [id]);
};

export {
    createGroup,
    listGroups,
    getGroup,
    updateGroup,
    deleteGroup
};
