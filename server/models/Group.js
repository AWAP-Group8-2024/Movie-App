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
  try {
    const result = await pool.query(query, [id]);
    return result;
  } catch (error) {
    return next(
      new ApiError("Internal server error while database queries.", 500)
    );
  }
};

export const insertNewGroup = async (name, description, creator_id) => {
  try {
    const result = await pool.query(
      "INSERT INTO groups (name, description, creator_id) values ($1, $2, $3) returning *",
      [name, description, creator_id]
    );
    return result;
  } catch (error) {
    return next(
      new ApiError("Internal server error while database queries.", 500)
    );
  }
};

export const insertUserGroupAssociation = async (group_id, user_id) => {
  try {
    const result = await pool.query(
      "INSERT INTO group_account (group_id, account_id) VALUES ($1, $2) returning *",
      [group_id, user_id]
    );
    return result;
  } catch (error) {
    return next(
      new ApiError("Internal server error while database queries.", 500)
    );
  }
};

export const getGroupDetails = async (groupId) => {
  try {
    const result = await pool.query(
      "SELECT id, name, description, creator_id FROM groups WHERE id = $1;",
      [groupId]
    );
    return result.rows[0];
  } catch (error) {
    return next(
      new ApiError("Internal server error while database queries.", 500)
    );
  }
};

// update group details by group id
export const updateGroupDetails = async (groupId, name, description) => {
  try {
    const result = await pool.query(
      "UPDATE groups SET name = $1, description = $2 WHERE id = $3 RETURNING *",
      [name, description, groupId]
    );
    return result.rows[0];
  } catch (error) {
    return next(
      new ApiError("Internal server error while database queries.", 500)
    );
  }
};

export const getGroupMembers = async (groupId) => {
  try {
    const query = `SELECT a.id, a.email, a.firstname, a.lastname
    FROM group_account ga
    JOIN account a ON ga.account_id = a.id 
    WHERE ga.group_id = $1
    ORDER BY id
    `;
    const { rows } = await pool.query(query, [groupId]);
    return rows;
  } catch (error) {
    return next(
      new ApiError("Internal server error while database queries.", 500)
    );
  }
};

// Function to allow a user to leave a group
export const leaveGroup = async (groupId, userId) => {
  try {
    const query = `
    DELETE FROM group_account
    WHERE group_id = $1 AND account_id = $2
    RETURNING *;
  `;
    const values = [groupId, userId];
    const { rows } = await pool.query(query, values);
    return rows[0];
  } catch (error) {
    return next(
      new ApiError("Internal server error while database queries.", 500)
    );
  }
};

export const deleteGroupById = async (groupId) => {
  try {
    const { rows } = await pool.query(
      "DELETE FROM groups WHERE id = $1 returning *",
      [groupId]
    );
    return rows[0];
  } catch (error) {
    return next(
      new ApiError("Internal server error while database queries.", 500)
    );
  }
};

export const addUserToGroup = async (groupId, accountId) => {
  try {
    const query = `
    INSERT INTO group_account (group_id, account_id)
    VALUES ($1, $2) ON CONFLICT DO NOTHING returning *;
  `;
    const result = await pool.query(query, [groupId, accountId]);
    return result;
  } catch (error) {
    return next(
      new ApiError("Internal server error while database queries.", 500)
    );
  }
};

// Function to remove a user from a group
export const removeUserFromGroup = async (groupId, memberId) => {
  try {
    const query = `
    DELETE FROM group_account
    WHERE group_id = $1 AND account_id = $2
    RETURNING *;
  `;
    const values = [groupId, memberId];
    const { rows } = await pool.query(query, values);
    return rows[0];
  } catch (error) {
    return next(
      new ApiError("Internal server error while database queries.", 500)
    );
  }
};

export const selectAllPosts = async (groupId) => {
  return await pool.query("SELECT * FROM group_post WHERE group_id = $1", [
    groupId,
  ]);
};

export const insertPost = async (groupId, accountId, description) => {
  return await pool.query(
    "INSERT INTO group_post (group_id, writer_id, description) VALUES ($1,$2,$3) RETURNING *",
    [groupId, accountId, description]
  );
};

export const deletePost = async (groupId, postId) => {
  return await pool.query(
    "DELETE FROM group_post WHERE group_id = $1 AND post_id = $2",
    [groupId, postId]
  );
};
