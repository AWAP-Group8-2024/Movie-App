import * as GroupModel from "../models/Group.js";
import * as JoinRequestModel from "../models/JoinRequest.js";
import { ApiError } from "../helpers/apiError.js";

// Listing is available for all user
export const getAllGroupsListing = async (req, res, next) => {
  try {
    const result = await GroupModel.getAllGroups();
    return res.status(200).json(result.rows || []);
  } catch (error) {
    return next(new ApiError("Server error while getAllGroupsListing", 500));
  }
};

export const getGroupsByAuth = async (req, res, next) => {
  try {
    const { id } = req.user;
    if (!id) {
      return next(new ApiError("Bad Request - Invalid user ID provided", 400));
    }
    const result = await GroupModel.getGroupsInfoByUserId(id);
    return res.status(200).json(result.rows || []);
  } catch (error) {
    return next(new ApiError("Server error while getGroupsByAuth", 500));
  }
};

// for sharing profile use
export const getGroupsByUrlId = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return next(new ApiError("Bad Request - Invalid user ID provided", 400));
    }
    const result = await GroupModel.getGroupsInfoByUserId(id);
    return res.status(200).json(result.rows || []);
  } catch (error) {
    return next(new ApiError("Server error while getGroupsByUrlId", 500));
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
    return next(new ApiError("Server error while createNewGroup", 500));
  }
};

export const getGroupDetails = async (req, res, next) => {
  const { groupId } = req.params;
  try {
    const group = await GroupModel.getGroupDetails(groupId);
    if (!group) {
      return next(new ApiError("Group not found", 404));
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
    return next(new ApiError("Server error while getGroupDetails", 500));
  }
};

export const updateGroupDetails = async (req, res, next) => {
  const { groupId } = req.params;
  const { name, description } = req.body;

  try {
    const group = await GroupModel.getGroupDetails(groupId);
    if (!group) {
      return next(new ApiError("Group not found", 404));
    }
    const result = await GroupModel.updateGroupDetails(
      groupId,
      name,
      description
    );
    return res.status(200).json({ message: "Group details updated", result });
  } catch (error) {
    return next(new ApiError("Server error while updateGroupDetails", 500));
  }
};

export const sendJoinRequest = async (req, res, next) => {
  const { groupId } = req.params;
  const { id } = req.user;
  try {
    const group = await GroupModel.getGroupDetails(groupId);
    if (!group) {
      return next(new ApiError("Group not found", 404));
    }

    const request = await JoinRequestModel.createJoinRequest(groupId, id);
    return res
      .status(201)
      .json({ message: "Join request sent successfully", request });
  } catch (error) {
    return next(new ApiError("Server error while sendJoinRequest", 500));
  }
};

export const cancelJoinRequest = async (req, res, next) => {
  const { groupId } = req.params;
  const { id } = req.user;

  try {
    const group = await GroupModel.getGroupDetails(groupId);
    if (!group) {
      return next(new ApiError("Group not found", 404));
    }

    const result = await JoinRequestModel.cancelRequest(groupId, id);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Request not found" });
    }

    const request = result.rows[0];
    return res
      .status(200)
      .json({ message: "Join request cancel successfully", request });
  } catch (error) {
    return next(new ApiError("Server error while cancelJoinRequest", 500));
  }
};

export const getGroupMembers = async (req, res, next) => {
  const { groupId } = req.params;

  try {
    const group = await GroupModel.getGroupDetails(groupId);
    if (!group) {
      return next(new ApiError("Group not found", 404));
    }
    const members = await GroupModel.getGroupMembers(groupId);
    return res.status(200).json(members || []);
  } catch (error) {
    return next(new ApiError("Server error while getGroupMembers", 500));
  }
};

// Controller for user to leave the group
export const leaveGroup = async (req, res, next) => {
  const { groupId } = req.params;
  const { id } = req.user;

  try {
    const result = await GroupModel.leaveGroup(groupId, id);

    if (!result) {
      return next(new ApiError("You are not a member of this group", 404));
    }

    return res.status(200).json({ message: "You have left the group" });
  } catch (error) {
    return next(new ApiError("Server error while leaveGroup", 500));
  }
};

export const deleteGroupByGroupId = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const group = await GroupModel.deleteGroupById(groupId);

    if (!group) {
      console.error(`Group with ID ${groupId} not found`); // Error log
      return next(new ApiError("Group not found", 404));
    }

    const response = {
      group: group,
      message: `Group '${group.name}' with ID ${group.id} deleted successfully.`,
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error("Error in deleteGroupByGroupId:", error); // Log error
    return next(new ApiError("Server error while deleteGroupByGroupId", 500));
  }
};

export const viewPendingRequests = async (req, res) => {
  const { groupId } = req.params;

  try {
    const requests = await JoinRequestModel.getPendingRequests(groupId);
    return res.status(200).json(requests);
  } catch (error) {
    return next(new ApiError("Server error while viewPendingRequests", 500));
  }
};

export const updateJoinRequestStatus = async (req, res, next) => {
  const { requestId } = req.params;
  const { status } = req.body; // 'accepted' or 'rejected'

  if (!["accepted", "rejected"].includes(status)) {
    return next(
      new ApiError("Invalid status. It must be 'accepted' or 'rejected'", 400)
    );
  }

  try {
    const updatedRequest = await JoinRequestModel.updateJoinRequestStatus(
      requestId,
      status
    );

    if (!updatedRequest) {
      return next(new ApiError("Join request not found", 404));
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
    return next(
      new ApiError("Server error while updateJoinRequestStatus", 500)
    );
  }
};

// Controller to remove a member from the group
export const removeMember = async (req, res, next) => {
  const { groupId, memberId } = req.params;

  try {
    const result = await GroupModel.removeUserFromGroup(groupId, memberId);

    if (!result) {
      return next(new ApiError("Member not found in the group", 404));
    }

    return res.status(200).json({ message: "Member removed from the group" });
  } catch (error) {
    return next(new ApiError("Server error while removeMember", 500));
  }
};

export const getAllGroupPosts = async (req, res, next) => {
  const { groupId } = req.params;
  try {
    const result = await GroupModel.selectAllPosts(groupId);
    return res.status(200).json(result.rows || []);
  } catch (error) {
    return next(new ApiError("Server error while getAllGroupPosts", 500));
  }
};

export const createPost = async (req, res, next) => {
  const { groupId } = req.params;
  const { accountId, description } = req.body;

  if (!description) {
    return next(new ApiError("Missing required fields", 400));
  }

  try {
    const result = await GroupModel.insertPost(groupId, accountId, description);
    return res.status(200).json({
      message: "Post created successfully.",
      post: result.rows[0],
    });
  } catch (error) {
    return next(new ApiError("Server error while createPost", 500));
  }
};

export const deletePost = async (req, res, next) => {
  const { groupId, postId } = req.params;

  try {
    const result = await GroupModel.deletePost(groupId, postId);

    if (result.rowCount === 0) {
      return next(new ApiError("Post not found", 404));
    }
    return res.status(200).json({ message: "Post deleted successfully." });
  } catch (error) {
    return next(new ApiError("Server error while deletePost", 500));
  }
};

export const updatePost = async (req, res, next) => {
  const { groupId, postId } = req.params;
  const { description } = req.body;

  try {
    const result = await GroupModel.updatePost(groupId, postId, description);
    if (result.rowCount === 0) {
      return next(new ApiError("Post not found", 404));
    }
    return res.status(200).json({
      message: "Post updated successfully.",
      post: result.rows[0],
    });
  } catch (error) {
    return next(new ApiError("Server error while updatePost", 500));
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
