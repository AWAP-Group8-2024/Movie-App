import {
  getGroupDetailsById,
  getAllGroups,
  getGroupsForUser,
  insertNewGroup,
  insertUserGroupAssociation,
} from "../models/Group.js";

import { ApiError } from "../helpers/apiError.js";

const getAllGroupsListing = async (req, res, next) => {
  try {
    const result = await getAllGroups();
    return res.status(200).json(result.rows || []);
  } catch (error) {
    return next(error);
  }
};

const getGroupsByUserId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await getGroupsForUser(id);
    return res.status(200).json(result.rows || []);
  } catch (error) {
    return next(error);
  }
};

const getGroupByGroupId = async (req, res, next) => {
  const { groupId } = req.params;

  try {
    const group = await getGroupDetailsById(groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    return res
      .status(200)
      .json(createGroupObj(group.id, group.name, group.creator_id));
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

const createNewGroup = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { name } = req.body;
    if (!isGroupNameValid) return next(new ApiError("Invalid group name", 400));
    const groupResult = await insertNewGroup(name, id);

    const group = groupResult.rows[0];
    console.log(group);
    await insertUserGroupAssociation(group.id, id);

    return res
      .status(201)
      .json(createGroupObj(group.id, group.name, group.creator_id));
  } catch (error) {
    return next(error);
  }
};

const createGroupObj = (id, name, creator_id) => {
  return {
    id: id,
    name: name,
    creator_id: creator_id,
  };
};

const isGroupNameValid = (groupName) => {
  return groupName && groupName.trim().length > 0;
};

export {
  getAllGroupsListing,
  getGroupsByUserId,
  createNewGroup,
  getGroupByGroupId,
};
