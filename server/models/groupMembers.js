import exp from "constants";
import { pool } from "../helpers/db.js";

const getGroupMemberById = async (groupId, id) => {
    const result = await pool.query(
        "SELECT * FROM group_members WHERE group_id = $1 AND id = $2",
        [groupId, id]
    );
    return result.rows[0];
}

const getAllGroupMembers = async (groupId) => {
    const result = await pool.query(
        "SELECT * FROM group_members WHERE group_id = $1",
        [groupId]
    );
    return result.rows;
};
  // Check if a user is a member of a group

const isGroupMember = async (groupId, id) => {
    const result = await pool.query(
        "SELECT * FROM group_members WHERE group_id = $1 AND id = $2",
        [groupId, id]
    );
    return result;
};

const addGroupMember = async (groupId, id) => {
  const result = await pool.query(
    "INSERT INTO group_members (group_id, id) values ($1,$2) returning *",
    [groupId, id]
  );
  return result.rows[0];
};


const deleteGroupMember = async (groupId, id) => {
    const result = await pool.query(
        "DELETE FROM group_members WHERE group_id = $1 AND id = $2",
        [groupId, id]
    );
    return result.rowCount > 0;
}
    
export {
    getGroupMemberById,
    getAllGroupMembers,
    isGroupMember,
    addGroupMember,
    deleteGroupMember
};