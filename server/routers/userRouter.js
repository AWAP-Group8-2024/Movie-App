import { Router } from "express";
import dotenv from "dotenv";
import {
  registration,
  login,
  getUserProfile,
  deleteUser,
  updateUserProfile,
  getGroupPendingRequests,
  passwordCheck,
} from "../controllers/UserController.js";

import { auth } from "../helpers/auth.js";

dotenv.config();

const router = Router();

router.post("/register", registration);
router.post("/login", login);

router.get("/profile/:id", auth, getUserProfile);
router.put("/profile/:id", auth, updateUserProfile);

router.post("/passwordCheck", auth, passwordCheck);
router.delete("/deleteAccount", auth, deleteUser);

router.get("/groupPendingRequests", auth, getGroupPendingRequests);

export default router;
