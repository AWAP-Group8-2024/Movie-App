import { pool } from "../helpers/db.js";

export const getFavoriteListByUserId = async (id) => {
  const result = await pool.query(
    "SELECT * FROM favorite where account_id = $1",
    [id]
  );
  return result;
};

export const addContentToFavoriteList = async (id, content) => {
  const { content_id, title, media_type, poster_path } = content;
  const result = await pool.query(
    "INSERT INTO favorite (account_id, content_id, title, media_type, poster_path, added_date) values ($1, $2, $3, $4, $5, NOW()) returning *",
    [id, content_id, title, media_type, poster_path]
  );
  return result;
};

export const isFavorite = async (id, content_id) => {
  const result = await pool.query(
    "SELECT * FROM favorite where account_id = $1 and content_id = $2",
    [id, content_id]
  );

  return result.rowCount > 0;
};

export const deleteFavorite = async (content_id) => {
  const result = await pool.query(
    "DELETE FROM favorite WHERE content_id = $1",
    [content_id]
  );
  return result;
};
