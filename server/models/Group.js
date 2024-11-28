import { pool } from "../helpers/db.js";

export const getAllGroups = async () => {
  const result = await pool.query("SELECT * from groups");
  return result;
};

export const getGroupsInfoByUserId = async (id) => {
  const query = `
  SELECT g.id, g.name, g.creator_id, COUNT(ga.account_id) AS member_count
  FROM groups g
  LEFT JOIN group_account ga ON g.id = ga.group_id
  WHERE g.id IN ( SELECT group_id FROM group_account WHERE account_id = $1)
  GROUP BY g.id
  ORDER BY g.id
`;
  const result = await pool.query(query, [id]);
  return result;
};

export const insertNewGroup = async (name, description, creator_id) => {
  const result = await pool.query(
    "INSERT INTO groups (name, description, creator_id) values ($1, $2, $3) returning *",
    [name, description, creator_id]
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
    "SELECT id, name, description, creator_id FROM groups WHERE id = $1;",
    [groupId]
  );
  return result.rows[0];
};

export const getGroupMembers = async (groupId) => {
  const result = await pool.query(
    "SELECT a.id, a.email, a.firstname, a.lastname FROM group_account ga JOIN account a ON ga.account_id = a.id WHERE ga.group_id = $1;",
    [groupId]
  );
  return result;
};

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

// export const checkUserInGroupByUserId = async (id) => {
//   const query = `
//   SELECT g.id AS group_id, g.name AS group_name
//   FROM groups g
//   JOIN group_account ga ON g.id = ga.group_id
//   WHERE ga.account_id = $1;
// `;
//   const result = await pool.query(query, [id]);
//   return result;
// };
// update group details by group id
export const updateGroupDetails = async (groupId, name, description) => {
  const result = await pool.query(
    "UPDATE groups SET name = $1, description = $2 WHERE id = $3 RETURNING *",
    [name, description, groupId]
  );
  return result;
};
// Function to remove a user from a group
export const removeUserFromGroup = async (groupId, memberId) => {
  const query = `
    DELETE FROM group_account
    WHERE group_id = $1 AND account_id = $2
    RETURNING *;
  `;
  const values = [groupId, memberId];

  try {
    const result = await pool.query(query, values);
    return result;
  } catch (error) {
    throw new Error("Error removing user from group: " + error.message);
  }
};

// Function to allow a user to leave a group
export const leaveGroup = async (groupId, userId) => {
  const query = `
    DELETE FROM group_account
    WHERE group_id = $1 AND account_id = $2
    RETURNING *;
  `;
  const values = [groupId, userId];

  try {
    const result = await pool.query(query, values);
    return result;
  } catch (error) {
    throw new Error("Error leaving the group: " + error.message);
  }
};

export const selectAllPosts = async (groupId) => {
  return await pool.query('SELECT * FROM group_post WHERE group_id = $1', [groupId]);
}

export const insertPost = async (groupId, accountId, description) => {
  return await pool.query('INSERT INTO group_post (group_id, writer_id, description) VALUES ($1,$2,$3) RETURNING *', [groupId, accountId, description]);
}

export const deletePost = async (groupId, postId) => {
  return await pool.query('DELETE FROM group_post WHERE group_id = $1 AND post_id = $2', [groupId, postId]);
}