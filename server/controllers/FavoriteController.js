import * as FavoriteModel from "../models/Favorite.js";
import { ApiError } from "../helpers/apiError.js";

export const getFavoriteListByAuth = async (req, res, next) => {
  try {
    const { id } = req.user;
    const result = await FavoriteModel.getFavoriteListByUserId(id);
    return res.status(200).json(result.rows || []);
  } catch (error) {
    return next(new ApiError("Server error while getFavoriteListByAuth", 500));
  }
};

export const getFavoriteListById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await FavoriteModel.getFavoriteListByUserId(id);
    return res.status(200).json(result.rows || []);
  } catch (error) {
    return next(new ApiError("Server error while getFavoriteListById", 500));
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
    return next(
      new ApiError("Server error while insertContentToFavorite", 500)
    );
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
    return next(new ApiError("Server error while checkFavoriteById", 500));
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
    return next(new ApiError("Server error while deleteFavoriteById", 500));
  }
};
