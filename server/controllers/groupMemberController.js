import {
    getAllGroupMembers,
    isGroupMember,
    addGroupMember,
    deleteGroupMember
} from '../models/groupMembers.js';

const getAllMembersController = async (req, res) => {
    try {
        const { groupId } = req.params;
        const members = await getAllGroupMembers(groupId);
        res.status(200).json(members);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const isMemberController = async (req, res) => {
    try {
        const { groupId, id } = req.params;
        const result = await isGroupMember(groupId, id);
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
} 

const addMemberController = async (req, res) => {
    try {
        const { groupId, id } = req.params;
        const result = await addGroupMember(groupId, id);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const deleteMemberController = async (req, res) => {
    try {
        const { groupId, id } = req.params;
        const result = await deleteGroupMember(groupId, id);
        res.status(200).json({ message: "Member deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export {
    getAllMembersController,
    isMemberController,
    addMemberController,
    deleteMemberController
};
