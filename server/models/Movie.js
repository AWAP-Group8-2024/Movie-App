import { pool } from "../helpers/db.js";

export const getReview = async (movieId) => {
  const result = await pool.query(
    `SELECT * FROM review
       WHERE movie_id = $1
       ORDER BY timestamp DESC`,
    [movieId]
  );
  return result;
};

export const addReview = async (movieId, userid, description, rating, email) => {
  const result = await pool.query(
    `INSERT INTO review (movie_id, user_id, description,rating, reviewer_email) values ($1,$2,$3,$4,$5) returning *`,
    [movieId, userid, description, rating, email]
  );
  return result;
};

export const editReview = async (id, description, rating) => {
  const result = await pool.query(
    `UPDATE review 
             SET description = $1, rating = $2
             WHERE id = $3 RETURNING *`,
    [description, rating, id]
  );
  return result;
};

export const deleteReview = async (reviewId) => {
  const result = await pool.query(
    `DELETE from review 
            WHERE id = $1 RETURNING *`, [reviewId]
  );
  if (result.rowCount === 0) {
    return json({ error: "Review not found" });
  }
};