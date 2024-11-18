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
    if (!content.imdb_id || !content.title || !content.media_type) {
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

export const createContentObj = (id, name, creator_id) => {
  return {
    id: id,
    name: name,
    creator_id: creator_id,
  };
};
