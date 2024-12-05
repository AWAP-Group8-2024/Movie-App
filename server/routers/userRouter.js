import { Router } from "express";
import dotenv from "dotenv";
import * as UserController from "../controllers/userController.js";

import { auth } from "../helpers/auth.js";

dotenv.config();

const router = Router();

router.post("/register", UserController.registration);
router.post("/login", UserController.login);

router.get("/profile/:id", auth, UserController.getUserProfile);
router.put("/profile/:id", auth, UserController.updateUserProfile);

router.post("/passwordCheck", auth, UserController.passwordCheck);
router.delete("/deleteAccount", auth, UserController.deleteUser);

router.get(
  "/groupPendingRequests",
  auth,
  UserController.getGroupPendingRequests
);

export default router;
