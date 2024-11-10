import { Router } from "express";
import dotenv from "dotenv";
import {
  registration,
  login,
  getUserProfile,
  deleteUser,
} from "../controllers/UserController.js";
import {
  getGroupsByUserId,
  getGroupByGroupId,
} from "../controllers/GroupController.js";
import { auth, verifyUserInGroup } from "../helpers/auth.js";

dotenv.config();

const router = Router();

router.post("/register", registration);
router.post("/login", login);
router.post("/profile/:id", auth, getUserProfile);
router.delete("/profile/:id", auth, deleteUser);

// get user's groups
router.get("/:id/groups", auth, getGroupsByUserId);
// access group if the user joined the group.
router.get("/:id/group/:groupId", auth, verifyUserInGroup, getGroupByGroupId);

export default router;
