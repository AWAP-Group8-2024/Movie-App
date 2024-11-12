import { pool } from "../helpers/db.js";

export const getAllGroups = async () => {
  const result = await pool.query("SELECT * from groups");
  return result;
};

export const getGroupsForUser = async (id) => {
  const query = `
  SELECT g.id AS group_id, g.name AS group_name
  FROM groups g
  JOIN group_account ga ON g.id = ga.group_id
  WHERE ga.account_id = $1;
`;
  const result = await pool.query(query, [id]);
  return result;
};

export const insertNewGroup = async (name, creator_id) => {
  const result = await pool.query(
    "INSERT INTO groups (name, creator_id) values ($1, $2) returning *",
    [name, creator_id]
  );
  return result;
};

export const insertUserGroupAssociation = async (group_id, user_id) => {
  const result = await pool.query(
    "INSERT INTO group_account (group_id, account_id) VALUES ($1, $2) returning *",
    [group_id, user_id]
  );
  return result;
};

export const getGroupDetailsById = async (groupId) => {
  const result = await pool.query(
    "SELECT id, name, creator_id FROM groups WHERE id = $1;",
    [groupId]
  );
  return result.rows[0];
};

// export const getGroupMembers = async (groupId) => {
//   const query = `
//     SELECT a.id, a.email, a.firstname, a.lastname
//     FROM group_account ga
//     JOIN account a ON ga.account_id = a.id
//     WHERE ga.group_id = $1;
//   `;
//   const { result } = await pool.query(query, [groupId]);
//   return result;
// };

export const deleteGroupById = async (groupId) => {
  const result = await pool.query("DELETE FROM groups WHERE id = $1", [
    groupId,
  ]);
  return result;
};

export const addUserToGroup = async (groupId, accountId) => {
  const query = `
    INSERT INTO group_account (group_id, account_id)
    VALUES ($1, $2) ON CONFLICT DO NOTHING returning *;
  `;
  const result = await pool.query(query, [groupId, accountId]);
  return result;
};
