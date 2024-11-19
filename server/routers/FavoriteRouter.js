import { Router } from "express";
import { auth } from "../helpers/auth.js";
import * as FavoriteController from "../controllers/FavoriteController.js";

const router = Router();

router.get("/", auth, FavoriteController.getFavoriteList);
router.post("/add", auth, FavoriteController.insertContentToFavorite);
router.post("/check", auth, FavoriteController.checkFavoriteById);

export default router;
