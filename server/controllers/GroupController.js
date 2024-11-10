// ../controllers/GroupControllers.js
import * as GroupModel from "../models/group.js";

const createGroupController = async (req, res) => {
    try {
        const { name, description } = req.body;
        const result = await GroupModel.createGroup(name, description);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getAllGroupsController = async (req, res) => {
    try {
        const groups = await GroupModel.listGroups();
        res.status(200).json(groups);
    } catch (err) {
        res.status(500).json({ error: "Error fetching groups" });
    }
};

const getGroupByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const group = await GroupModel.getGroup(id);
        res.status(200).json(group);
    } catch (err) {
        res.status(500).json({ error: "Error fetching group" });
    }
};

const updateGroupController = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        const group = await GroupModel.updateGroup(id, name, description);
        res.status(200).json(group);
    } catch (err) {
        res.status(500).json({ error: "Error updating group" });
    }
};

const deleteGroupController = async (req, res) => {
    try {
        const { id } = req.params;
        await GroupModel.deleteGroup(id);
        res.status(200).json({ message: "Group deleted" });
    } catch (err) {
        res.status(500).json({ error: "Error deleting group" });
    }
};

export {
    createGroupController as createGroup,
    getAllGroupsController as getAllGroups,
    getGroupByIdController as getGroup,
    updateGroupController as updateGroup,
    deleteGroupController as deleteGroup
};
