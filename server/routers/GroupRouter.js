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

// Fetch a list of all groups for all users.
router.get("/", auth, GroupController.getAllGroupsListing);
// listing user's groups that user's joined already.
router.get("/all", auth, GroupController.getGroupsByAuth);

// for sharing profile use
router.get("/userGroup/:id", auth, GroupController.getGroupsByUrlId);

router.post("/create", auth, GroupController.createNewGroup);

// access group if the user joined the group.
router.get(
  "/:groupId",
  auth,
  // verifyUserInGroup,
  GroupController.getGroupByGroupId
);

router.get("/:groupId/members", auth, GroupController.getGroupMembers);

// delete group if user is the owner
router.delete(
  "/delete/:groupId",
  auth,
  verifyCreatorIsValid,
  GroupController.deleteGroupByGroupId
);

router.post("/:groupId/join", auth, GroupController.sendJoinRequest);
router.delete("/:groupId/cancel", auth, GroupController.cancelJoinRequest);

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

// update group details
router.put("/:groupId", auth, GroupController.updateGroupDetails);

// leave group
router.delete("/:groupId/leave", auth, GroupController.leaveGroup);

router.get("/:groupId/posts", GroupController.getAllGroupPosts); // Get all posts
router.post("/:groupId/posts", GroupController.createPost); // Create a post
router.delete("/delete/:groupId/posts/:postId", GroupController.deletePost); // Delete a post

export default router;
