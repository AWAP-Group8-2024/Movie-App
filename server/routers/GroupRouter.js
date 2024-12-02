import { Router } from "express";
import dotenv from "dotenv";
import * as GroupController from "../controllers/GroupController.js";
import { auth, verifyCreatorIsValid } from "../helpers/auth.js";

dotenv.config();

const router = Router();

// Fetch a list of all groups for all users.
router.get("/", auth, GroupController.getAllGroupsListing);
// listing user's groups that user's joined already.
router.get("/all", auth, GroupController.getGroupsByAuth);

// for sharing profile use
router.get("/userGroup/:id", auth, GroupController.getGroupsByUrlId);

router.post("/create", auth, GroupController.createNewGroup);

// get group details
router.get("/:groupId", auth, GroupController.getGroupDetails);

// update group details
router.put("/:groupId", auth, GroupController.updateGroupDetails);

router.post("/:groupId/join", auth, GroupController.sendJoinRequest);

router.delete("/:groupId/cancel", auth, GroupController.cancelJoinRequest);

router.get("/:groupId/members", auth, GroupController.getGroupMembers);

// Allow a member to leave the group (any member can leave)
router.delete("/:groupId/leave", auth, GroupController.leaveGroup);

// delete group if user is the owner
router.delete(
  "/delete/:groupId",
  auth,
  verifyCreatorIsValid,
  GroupController.deleteGroupByGroupId
);

// get pending join group requests as an owner
router.get(
  "/:groupId/requests",
  auth,
  verifyCreatorIsValid,
  GroupController.viewPendingRequests
);

// update join requests status, accepted or rejected
router.put(
  "/:groupId/requests/:requestId",
  auth,
  verifyCreatorIsValid,
  GroupController.updateJoinRequestStatus
);

// Remove a member from the group (only accessible by the group creator)
router.delete(
  "/:groupId/remove/:memberId",
  auth,
  verifyCreatorIsValid,
  GroupController.removeMember
);

// group posts section
router.get("/:groupId/posts", auth, GroupController.getAllGroupPosts); // Get all posts
router.post("/:groupId/posts", auth, GroupController.createPost); // Create a post
router.delete(
  "/delete/:groupId/posts/:postId",
  auth,
  GroupController.deletePost
); // Delete a post
router.put("/edit/:groupId/posts/:postId", auth, GroupController.updatePost); // Edit a post

export default router;
