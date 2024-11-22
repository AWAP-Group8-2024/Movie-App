import { Router } from "express";
import dotenv from "dotenv";
import * as GroupController from "../controllers/GroupController.js";
import {
  auth,
  verifyUserInGroup,
  verifyCreatorIsValid,
} from "../helpers/auth.js";

dotenv.config();

const router = Router();

router.get("/", auth, GroupController.getAllGroupsListing);

router.post("/create", auth, GroupController.createNewGroup);

// list user's groups
router.get("/all", auth, GroupController.getGroupsByUserId);

// access group if the user joined the group.
router.get(
  "/:groupId",
  auth,
  // verifyUserInGroup,
  GroupController.getGroupByGroupId
);

router.get(
  "/:groupId/members", 
  auth,
  GroupController.getGroupMembers
);

// delete group if user is the owner
router.delete(
  "/delete/:groupId",
  auth,
  verifyCreatorIsValid,
  GroupController.deleteGroupByGroupId
);

router.post("/:groupId/join", auth, GroupController.sendJoinRequest);

router.get(
  "/:groupId/requests",
  auth,
  verifyCreatorIsValid,
  GroupController.viewPendingRequests
);

router.put(
  "/:groupId/requests/:requestId",
  auth,
  verifyCreatorIsValid,
  GroupController.updateJoinRequestStatus
);

// leave group
router.delete(
  "/:groupId/leave",
  auth,
  GroupController.leaveGroup
);
export default router;
