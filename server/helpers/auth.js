import jwt from "jsonwebtoken";
import { createUserObj } from "../controllers/UserController.js";
import { getGroupsInfoByUserId, getGroupDetailsById } from "../models/Group.js";
import { createGroupObj } from "../controllers/GroupController.js";

const { verify } = jwt;

export const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization required" });
  }
  try {
    const token = authHeader.split(" ")[1];
    const verifiedUser = verify(token, process.env.JWT_SECRET);

    // Attached user object to req for further uses.
    req.user = createUserObj(verifiedUser.id, verifiedUser.email);
    next();
  } catch (error) {
    console.error("Authorization error:", error);
    return res.status(403).json({ message: "Invalid credentials" });
  }
};

export const verifyUserInGroup = async (req, res, next) => {
  const { id } = req.user;
  console.log(req.user);
  const { groupId } = req.params;
  try {
    const groups = await getGroupsInfoByUserId(id);
    console.log(groups);
    const isUserInGroup = groups.rows.some(
      (group) => group.id === parseInt(groupId)
    );
    if (!isUserInGroup) {
      return res
        .status(403)
        .json({ message: "User is not a member of this group" });
    }
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error while checking group membership" });
  }
};

export const verifyCreatorIsValid = async (req, res, next) => {
  const { id } = req.user;
  const { groupId } = req.params;
  try {
    const group = await getGroupDetailsById(groupId);
    if (!group) {
      return res.status(404).json({
        message: "Group not found",
      });
    }
    if (id !== group.creator_id) {
      return res.status(400).json({
        message: `The user id: ${id} is not the owner of group ${groupId}. Only the group owner can proceed this operation`,
      });
    }
    // Attached group object to req for further uses.
    req.group = createGroupObj(group.id, group.name, group.creator_id);
    next();
  } catch (error) {
    return next(error);
  }
};
