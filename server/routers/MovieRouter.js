import { Router } from "express";
import dotenv from "dotenv";
import {details} from "../controllers/MovieController.js";

dotenv.config();

const router = Router();

router.post("/details", details);


export default router;