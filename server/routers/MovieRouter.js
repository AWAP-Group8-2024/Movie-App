import { Router } from "express";
import { auth } from "../helpers/auth.js";
import dotenv from "dotenv";
import * as MovieController from "../controllers/MovieController.js";

dotenv.config();

const router = Router();

router.get("/reviews/:id", MovieController.getReviews);
router.delete("/reviews/:id", MovieController.deleteReview);
router.post("/addReview", auth, MovieController.addReview);
router.put("/editReview/:id", auth, MovieController.editReview);

export default router;
