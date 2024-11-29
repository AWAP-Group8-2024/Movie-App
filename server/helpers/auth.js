import jwt from "jsonwebtoken";
import { createUserObj } from "../controllers/UserController.js";
import { createGroupObj } from "../controllers/GroupController.js";
import { getGroupDetails } from "../models/Group.js";
import { ApiError } from "./apiError.js";

const { verify } = jwt;

export const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next(new ApiError("Authorization required", 401));
  }
  try {
    const token = authHeader.split(" ")[1];
    const verifiedUser = verify(token, process.env.JWT_SECRET);

    // Attached user object to req for further uses.
    req.user = createUserObj(verifiedUser.id, verifiedUser.email);
    next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return next(
        new ApiError("Forbidden - Invalid credentials provided.", 403)
      );
    }
    return next(
      new ApiError("Server error during authorization verification", 500)
    );
  }
};

export const verifyCreatorIsValid = async (req, res, next) => {
  const { id } = req.user;
  const { groupId } = req.params;
  try {
    const group = await getGroupDetails(groupId);
    if (!group) {
      return next(new ApiError("Group not found", 404));
    }
    if (id !== group.creator_id) {
      return next(
        new ApiError(
          `The user id: ${id} is not the owner of group ${groupId}. Only the group owner can proceed this operation`,
          400
        )
      );
    }
    // Attached group object to req for further uses.
    req.group = createGroupObj(group.id, group.name, group.creator_id);
    next();
  } catch (error) {
    return next(new ApiError("Server error while verifyCreatorIsValid", 500));
  }
};
