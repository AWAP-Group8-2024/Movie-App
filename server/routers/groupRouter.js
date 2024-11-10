// ../routers/groupRouter.js
import { Router } from "express";
import dotenv from "dotenv";
import {
  createGroup,
  getGroup,
  getAllGroups,
  updateGroup,
  deleteGroup,
} from "../controllers/GroupController.js";
import groupMemberRouter from "./groupMemberRouter.js";
// import { auth } from "../helpers/auth.js";

dotenv.config();

const router = Router();

router.post("/create",  createGroup);
router.get("/:id",  getGroup);
router.get("/",  getAllGroups);
router.put("/update/:id",  updateGroup);
router.delete("/delete/:id",  deleteGroup);

// nested route for group members
router.use("/:id/members", groupMemberRouter);
export default router;
