import jwt from "jsonwebtoken";
const { verify } = jwt;
import { createUserObj } from "../controllers/UserController.js";
import { getGroupsForUser, getGroupDetailsById } from "../models/Group.js";
import { createGroupObj } from "../controllers/GroupController.js";

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.statusMessage = "Authorization required";
    res.status(401).json({ message: "Authorization required" });
  } else {
    try {
      const token = authHeader.split(" ")[1];
      const verifiedUser = verify(token, process.env.JWT_SECRET);

      // Attached user object to req for further uses.
      req.user = createUserObj(verifiedUser.id, verifiedUser.email);
      next();
    } catch (error) {
      console.error("Authorization error:", error);
      res.statusMessage = "Invalid credentials";
      return res.status(403).json({ message: "Invalid credentials" });
    }
  }
};

const verifyUserInGroup = async (req, res, next) => {
  const { id } = req.user;
  const { groupId } = req.params;
  try {
    const groups = await getGroupsForUser(id);
    const isUserInGroup = groups.rows.some(
      (group) => group.group_id === parseInt(groupId)
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

const verifyCreatorIsValid = async (req, res, next) => {
  const { id } = req.user;
  const { groupId } = req.params;
  try {
    const group = await getGroupDetailsById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    if (id !== group.creator_id) {
      return res.status(400).json({
        message: `The user id: ${id} is not the group owner. Only group owner can delete the group`,
      });
    }
    req.group = createGroupObj(group.id, group.name, group.creator_id);
    next();
  } catch (error) {
    return next(error);
  }
};

export { auth, verifyUserInGroup, verifyCreatorIsValid };
