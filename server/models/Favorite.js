import { ApiError } from "../helpers/apiError.js";
import axios from "axios";
import { pool } from "../helpers/db.js";

export const getFavoriteListByUserId = async (id) => {
  const result = await pool.query(
    "SELECT * FROM favorites where account_id = $1",
    [id]
  );
  return result;
};

export const addContentToFavoriteList = async (id, content) => {
  const { imdb_id, title, media_type, poster_path } = content;
  const result = await pool.query(
    "INSERT INTO favorite (account_id, imdb_id, title, media_type, poster_path, added_date) values ($1, $2, $3, $4, $5, NOW()) returning *",
    [id, imdb_id, title, media_type, poster_path]
  );
  return result;
};

export const isFavorite = async (id, imdb_id) => {
  const result = await pool.query(
    "SELECT * FROM favorite where account_id = $1 and imdb_id = $2",
    [id, imdb_id]
  );
  return result.rowCount > 0;
};
