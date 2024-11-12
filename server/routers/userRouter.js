import { Router } from "express";
import dotenv from "dotenv";
import {
  registration,
  login,
  getUserProfile,
  deleteUser,
} from "../controllers/UserController.js";

import { auth, verifyUserInGroup } from "../helpers/auth.js";

dotenv.config();

const router = Router();

router.post("/register", registration);
router.post("/login", login);
router.get("/profile/:id", getUserProfile);//does not require auth no more
router.delete("/profile/:id", auth, deleteUser);

export default router;
