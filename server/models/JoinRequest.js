import { pool } from "../helpers/db.js";

export const createJoinRequest = async (groupId, accountId) => {
  try {
    const query = `
    INSERT INTO join_requests (group_id, account_id) 
    VALUES ($1, $2) 
    RETURNING *;
  `;
    const { rows } = await pool.query(query, [groupId, accountId]);
    return rows[0];
  } catch (error) {
    return next(
      new ApiError("Internal server error while database queries.", 500)
    );
  }
};

export const cancelRequest = async (groupId, accountId) => {
  try {
    const query = `
    DELETE FROM join_requests WHERE group_id = $1 AND account_id = $2 RETURNING *
  `;
    const result = await pool.query(query, [groupId, accountId]);
    return result;
  } catch (error) {
    return next(
      new ApiError("Internal server error while database queries.", 500)
    );
  }
};

export const getPendingRequests = async (groupId) => {
  try {
    const query = `
    SELECT jr.id, a.email, a.firstname, a.lastname, jr.request_date 
    FROM join_requests jr
    JOIN account a ON jr.account_id = a.id
    WHERE jr.group_id = $1 AND jr.status = 'pending';
  `;
    const { rows } = await pool.query(query, [groupId]);
    return rows;
  } catch (error) {
    return next(
      new ApiError("Internal server error while database queries.", 500)
    );
  }
};

export const updateJoinRequestStatus = async (requestId, status) => {
  try {
    const query = `
    UPDATE join_requests 
    SET status = $1, response_date = CURRENT_TIMESTAMP
    WHERE id = $2 
    RETURNING *;
  `;
    const { rows } = await pool.query(query, [status, requestId]);
    return rows[0];
  } catch (error) {
    return next(
      new ApiError("Internal server error while database queries.", 500)
    );
  }
};

export const deleteJoinRequest = async (requestId, status) => {
  try {
    const query = `
    UPDATE join_requests 
    SET status = $1, response_date = CURRENT_TIMESTAMP
    WHERE id = $2 
    RETURNING *;
  `;
    const { rows } = await pool.query(query, [status, requestId]);
    return rows[0];
  } catch (error) {
    return next(
      new ApiError("Internal server error while database queries.", 500)
    );
  }
};
