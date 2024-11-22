import { Router } from "express";
import dotenv from "dotenv";
import {
  registration,
  login,
  getUserProfile,
  deleteUser,
  updateUserProfile,
  getGroupPendingRequests,
} from "../controllers/UserController.js";

import { auth } from "../helpers/auth.js";

dotenv.config();

const router = Router();

router.post("/register", registration);
router.post("/login", login);
router.post("/profile/:id", auth, getUserProfile);
router.delete("/profile/:id", auth, deleteUser);
router.put("/profile/:id", auth, updateUserProfile);
router.get("/groupPendingRequests", auth, getGroupPendingRequests);

export default router;
