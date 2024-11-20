import * as FavoriteModel from "../models/Favorite.js";

export const getFavoriteList = async (req, res, next) => {
  try {
    const { id } = req.user;
    const result = await FavoriteModel.getFavoriteListByUserId(id);
    return res.status(200).json(result.rows || []);
  } catch (error) {
    return next(error);
  }
};

export const insertContentToFavorite = async (req, res, next) => {
  try {
    const { id } = req.user;
    const content = req.body;
    if (!content.content_id || !content.title || !content.media_type) {
      return res
        .status(400)
        .json({ message: "All content fields are required" });
    }

    const result = await FavoriteModel.addContentToFavoriteList(id, content);
    return res.status(200).json(result.rows || []);
  } catch (error) {
    return next(error);
  }
};

export const checkFavoriteById = async (req, res) => {
  try {
    const { content_id } = req.body;
    const { id } = req.user;

    if (!content_id) {
      return res.status(400).json({ message: "content_id is required" });
    }

    const isFavorite = await FavoriteModel.isFavorite(id, content_id);

    return res.status(200).json({
      message: isFavorite
        ? "Content is in favorites"
        : "Content is not in favorites",
      favorite: isFavorite,
    });
  } catch (error) {
    console.error("Error in checkFavoriteById:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteFavoriteById = async (req, res) => {
  try {
    const { content_id } = req.body;
    if (!content_id) {
      return res.status(400).json({ message: "content_id is required" });
    }
    const result = await FavoriteModel.deleteFavorite(content_id);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Favorite not found" });
    }
    return res.status(200).json({ message: "Favorite deleted successfully" });
  } catch (error) {
    console.error("Error in deleteFavoriteById:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
