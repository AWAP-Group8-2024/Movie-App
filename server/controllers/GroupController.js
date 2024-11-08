import { fetchGroups, insertNewGroup } from "../models/Group.js";

import { ApiError } from "../helpers/apiError.js";

const getGroups = async (req, res, next) => {
  try {
    const result = await fetchGroups();
    return res.status(200).json(result.rows || []);
  } catch (error) {
    return next(error);
  }
};

const createNewGroup = async (req, res, next) => {
  try {
    const { groupName } = req.body;
    if (!isGroupNameValid) return next(new ApiError("Invalid group name", 400));
    const result = await insertNewGroup(groupName);
    const group = result.rows[0];
    return res.status(201).json(createGroupObj(group.id, group.name));
  } catch (error) {
    return next(error);
  }
};

const createGroupObj = (id, name) => {
  return {
    id: id,
    name: name,
  };
};

const isGroupNameValid = (groupName) => {
  return groupName && groupName.trim().length > 0;
};

export { getGroups, createNewGroup };
