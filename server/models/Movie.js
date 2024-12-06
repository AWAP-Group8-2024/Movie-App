import { pool } from "../helpers/db.js";
import { ApiError } from "../helpers/apiError.js";

export const getReview = async (movieId) => {
  try {
    const result = await pool.query(
      `SELECT * FROM review
         WHERE movie_id = $1
         ORDER BY timestamp DESC`,
      [movieId]
    );
    console.log(result);
    return result;
  } catch (error) {
    throw new ApiError("Internal server error while database queries.", 500);
  }
};

export const addReview = async (
  movieId,
  userid,
  description,
  rating,
  email
) => {
  try {
    const result = await pool.query(
      `INSERT INTO review (movie_id, user_id, description,rating, reviewer_email) values ($1,$2,$3,$4,$5) returning *`,
      [movieId, userid, description, rating, email]
    );
    return result;
  } catch (error) {
    throw new ApiError("Internal server error while database queries.", 500);
  }
};

export const editReview = async (id, description, rating) => {
  try {
    const result = await pool.query(
      `UPDATE review 
       SET description = $1, rating = $2
       WHERE id = $3 RETURNING *`,
      [description, rating, id]
    );
    return result;
  } catch (error) {
    throw new ApiError("Internal server error while database queries.", 500);
  }
};

export const deleteReview = async (reviewId) => {
  try {
    const result = await pool.query(
      "DELETE from review WHERE id = $1 RETURNING *",
      [reviewId]
    );
    return result;
  } catch (error) {
    throw new ApiError("Internal server error while database queries.", 500);
  }
};
