import { pool } from "../helpers/db.js";

export const createJoinRequest = async (groupId, accountId) => {
  const query = `
      INSERT INTO join_requests (group_id, account_id) 
      VALUES ($1, $2) 
      RETURNING *;
    `;
  const { rows } = await pool.query(query, [groupId, accountId]);
  return rows[0];
};

export const getPendingRequests = async (groupId) => {
  const query = `
      SELECT jr.id, a.email, a.firstname, a.lastname, jr.request_date 
      FROM join_requests jr
      JOIN account a ON jr.account_id = a.id
      WHERE jr.group_id = $1 AND jr.status = 'pending';
    `;
  const { rows } = await pool.query(query, [groupId]);
  return rows;
};

export const updateJoinRequestStatus = async (requestId, status) => {
  const query = `
      UPDATE join_requests 
      SET status = $1, response_date = CURRENT_TIMESTAMP
      WHERE id = $2 
      RETURNING *;
    `;
  const { rows } = await pool.query(query, [status, requestId]);
  return rows[0];
};
