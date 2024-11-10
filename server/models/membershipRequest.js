// models/membershipRequest.js
import pool from "../db.js";

class MembershipRequest {
  static async createRequest(groupId, userId) {
    const result = await pool.query(
      `INSERT INTO membership_requests (group_id, user_id) 
       VALUES ($1, $2) RETURNING *`,
      [groupId, userId]
    );
    return result.rows[0];
  }

  static async getRequestById(id) {
    const result = await pool.query(
      `SELECT * FROM membership_requests WHERE id = $1`,
      [id]
    );
    return result.rows[0];
  }

  static async updateRequestStatus(id, status) {
    const result = await pool.query(
      `UPDATE membership_requests SET status = $2 
       WHERE id = $1 RETURNING *`,
      [id, status]
    );
    return result.rows[0];
  }

  static async getRequestsByGroup(groupId) {
    const result = await pool.query(
      `SELECT * FROM membership_requests WHERE group_id = $1`,
      [groupId]
    );
    return result.rows;
  }

  static async deleteRequest(id) {
    const result = await pool.query(
      `DELETE FROM membership_requests WHERE id = $1 RETURNING *`,
      [id]
    );
    return result.rows[0];
  }
}

export default MembershipRequest;
