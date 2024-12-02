import { ApiError } from "../helpers/apiError.js";
import * as MovieModel from "../models/Movie.js";


// Get all reviews for a movie
export const getReviews = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await MovieModel.getReview(id);
    if (result.rowCount === 0) {
      return next(new ApiError("No reviews found", 200));
    }

    return res.status(200).json(result.rows || []);
  } catch (error) {
    return next(error);
  }
};

export const addReview = async (req, res, next) => {
  try {
    const { movie_id, user_id, description, rating, reviewer_email } = req.body;
    const result = await MovieModel.addReview(movie_id, user_id, description, rating, reviewer_email);

    return res.status(200).json(result.rows[0] || []);
  } catch (error) {
    return next(error);
  }
};

export const editReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { description, rating } = req.body;
    const result = await MovieModel.editReview(id, description, rating);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Review not found" });
    }

    return res.status(200).json(result.rows[0] || []);
  } catch (error) {
    return next(error);
  }
};


export const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await MovieModel.deleteReview(id);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Review not found" });
    }

    return res.status(200).json(result.rows[0] || []);
  } catch (error) {
    return next(error);
  }
};