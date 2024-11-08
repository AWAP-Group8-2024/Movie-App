import { pool } from "../helpers/db.js";

const fetchGroups = async () => {
  const result = await pool.query("SELECT * FROM groups");
  return result;
};

const insertNewGroup = async (groupName) => {
  const result = await pool.query(
    "INSERT INTO groups (name) values ($1) returning *",
    [groupName]
  );
  return result;
};

export { fetchGroups, insertNewGroup };
