import { Router } from "express";
import { auth } from "../helpers/auth.js";
import * as FavoriteController from "../controllers/FavoriteController.js";

const router = Router();

router.get("/", auth, FavoriteController.getFavoriteListByAuth);
router.get("/:id", auth, FavoriteController.getFavoriteListById);
router.post("/add", auth, FavoriteController.insertContentToFavorite);
router.post("/check", auth, FavoriteController.checkFavoriteById);
router.delete("/delete", auth, FavoriteController.deleteFavoriteById);

export default router;
