import * as GroupModel from "../models/Group.js";
import * as JoinRequestModel from "../models/JoinRequest.js";
import { ApiError } from "../helpers/apiError.js";
import { request } from "http";

// Listing is available for all user
export const getAllGroupsListing = async (req, res, next) => {
  try {
    const result = await GroupModel.getAllGroups();
    return res.status(200).json(result.rows || []);
  } catch (error) {
    return next(error);
  }
};

export const getGroupsByUserId = async (req, res, next) => {
  try {
    const { id } = req.user;
    const result = await GroupModel.getGroupsInfoByUserId(id);
    return res.status(200).json(result.rows || []);
  } catch (error) {
    return next(error);
  }
};

export const getGroupByGroupId = async (req, res, next) => {
  const { groupId } = req.params;

  try {
    const group = await GroupModel.getGroupDetailsById(groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    return res
      .status(200)
      .json(
        createGroupObj(
          group.id,
          group.name,
          group.description,
          group.creator_id
        )
      );
  } catch (error) {
    return next(error);
  }
};

export const getGroupMembers = async (req, res, next) => {
  const { groupId } = req.params;

  try {
    const members = await GroupModel.getGroupMembers(groupId);
    return res.status(200).json(members.rows || []);
  } catch (error) {
    return next(error);
  }
};

export const createNewGroup = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { name, description } = req.body;
    if (!isGroupNameValid) return next(new ApiError("Invalid group name", 400));
    const groupResult = await GroupModel.insertNewGroup(name, description, id);

    const group = groupResult.rows[0];
    await GroupModel.insertUserGroupAssociation(group.id, id);

    return res
      .status(201)
      .json(
        createGroupObj(
          group.id,
          group.name,
          group.description,
          group.creator_id
        )
      );
  } catch (error) {
    return next(error);
  }
};

export const deleteGroupByGroupId = async (req, res, next) => {
  try {
    const { id } = req.group;
    await GroupModel.deleteGroupById(id);
    const response = {
      group: req.group,
      message: `Group '${req.group.name}' with ID ${req.group.id} deleted successfully.`,
    };
    return res.status(200).json(response);
  } catch (error) {
    return next(error);
  }
};

export const sendJoinRequest = async (req, res) => {
  const { groupId } = req.params;
  const { id } = req.user;

  try {
    const request = await JoinRequestModel.createJoinRequest(groupId, id);
    return res
      .status(201)
      .json({ message: "Join request sent successfully", request });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const cancelJoinRequest = async (req, res) => {
  const { groupId } = req.params;
  const { id } = req.user;

  try {
    const result = await JoinRequestModel.cancelRequest(groupId, id);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Request not found" });
    }

    const request = result.rows[0];
    return res
      .status(200)
      .json({ message: "Join request cancel successfully", request });
  } catch (error) {
    console.error("Error canceling join request:", error);
    return res.status(500).json({ error: error.message });
  }
};

export const viewPendingRequests = async (req, res) => {
  const { groupId } = req.params;

  try {
    const requests = await JoinRequestModel.getPendingRequests(groupId);
    return res.status(200).json(requests);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateJoinRequestStatus = async (req, res) => {
  const { requestId } = req.params;
  const { status } = req.body; // 'accepted' or 'rejected'

  if (!["accepted", "rejected"].includes(status)) {
    return res
      .status(400)
      .json({ error: "Invalid status. It must be 'accepted' or 'rejected'" });
  }

  try {
    const updatedRequest = await JoinRequestModel.updateJoinRequestStatus(
      requestId,
      status
    );

    if (!updatedRequest) {
      return res.status(404).json({ error: "Join request not found" });
    }

    if (status === "accepted") {
      await GroupModel.addUserToGroup(
        updatedRequest.group_id,
        updatedRequest.account_id
      );
      return res.status(200).json({ message: "Join request accepted" });
    }

    return res.status(200).json({ message: "Join request rejected" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const createGroupObj = (id, name, description, creator_id) => {
  return {
    id: id,
    name: name,
    description: description,
    creator_id: creator_id,
  };
};

export const isGroupNameValid = (groupName) => {
  return groupName && groupName.trim().length > 0;
};

// leaveGroup
export const leaveGroup = async (req, res) => {
  const { groupId } = req.params;
  const { id } = req.user;

  try {
    await GroupModel.leaveGroup(groupId, id);
    return res.status(200).json({ message: "You have left the group" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
