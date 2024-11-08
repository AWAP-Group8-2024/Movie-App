import { Router } from "express";
import dotenv from "dotenv";
import { getGroups, createNewGroup } from "../controllers/GroupController.js";
import { auth } from "../helpers/auth.js";

dotenv.config();

const router = Router();

router.get("/", auth, getGroups);
router.post("/create", auth, createNewGroup);

export default router;
