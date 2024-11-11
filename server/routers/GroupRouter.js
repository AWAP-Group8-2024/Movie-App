import { Router } from "express";
import dotenv from "dotenv";
import {
  getGroupsByUserId,
  getGroupByGroupId,
  getAllGroupsListing,
  createNewGroup,
  deleteGroupByGroupId,
} from "../controllers/GroupController.js";
import {
  auth,
  verifyUserInGroup,
  verifyCreatorIsValid,
} from "../helpers/auth.js";

dotenv.config();

const router = Router();

router.get("/", auth, getAllGroupsListing);

router.post("/create", auth, createNewGroup);

// list user's groups
router.get("/all", auth, getGroupsByUserId);

// access group if the user joined the group.
router.get("/:groupId", auth, verifyUserInGroup, getGroupByGroupId);

// delete group if user is the owner
router.delete(
  "/delete/:groupId",
  auth,
  verifyCreatorIsValid,
  deleteGroupByGroupId
);

export default router;
