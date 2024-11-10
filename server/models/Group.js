import { pool } from "../helpers/db.js";

const getAllGroups = async () => {
  const result = await pool.query("SELECT * from groups");
  return result;
};

const getGroupsForUser = async (id) => {
  const query = `
  SELECT g.id AS group_id, g.name AS group_name
  FROM groups g
  JOIN group_account ga ON g.id = ga.group_id
  WHERE ga.account_id = $1;
`;
  const result = await pool.query(query, [id]);
  return result;
};

const insertNewGroup = async (name, creator_id) => {
  const result = await pool.query(
    "INSERT INTO groups (name, creator_id) values ($1, $2) returning *",
    [name, creator_id]
  );
  return result;
};

const insertUserGroupAssociation = async (group_id, user_id) => {
  const result = await pool.query(
    "INSERT INTO group_account (group_id, account_id) VALUES ($1, $2) returning *",
    [group_id, user_id]
  );
  return result;
};

const getGroupDetailsById = async (groupId) => {
  const result = await pool.query(
    "SELECT id, name, creator_id FROM groups WHERE id = $1;",
    [groupId]
  );
  return result.rows[0];
};

export {
  getAllGroups,
  getGroupsForUser,
  insertNewGroup,
  insertUserGroupAssociation,
  getGroupDetailsById,
};
