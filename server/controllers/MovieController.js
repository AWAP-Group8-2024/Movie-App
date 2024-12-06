import { ApiError } from "../helpers/apiError.js";
import * as MovieModel from "../models/Movie.js";

// Get all reviews for a movie
export const getReviews = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await MovieModel.getReview(id);
    if (result.rowCount === 0) {
      return next(new ApiError("Review not found", 404));
    }
    console.log(result);
    return res.status(200).json(result.rows || []);
  } catch (error) {
    return next(new ApiError("Server error while getReviews", 500));
  }
};

export const addReview = async (req, res, next) => {
  try {
    const { movie_id, user_id, description, rating, reviewer_email } = req.body;
    const result = await MovieModel.addReview(
      movie_id,
      user_id,
      description,
      rating,
      reviewer_email
    );

    return res.status(200).json(result.rows[0] || []);
  } catch (error) {
    return next(new ApiError("Server error while addReview", 500));
  }
};

export const editReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { description, rating } = req.body;
    const result = await MovieModel.editReview(id, description, rating);

    if (result.rowCount === 0) {
      return next(new ApiError("Review not found", 404));
    }

    return res.status(200).json(result.rows[0] || []);
  } catch (error) {
    return next(new ApiError("Server error while editReview", 500));
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await MovieModel.deleteReview(id);

    if (result.rowCount === 0) {
      return next(new ApiError("Review not found", 404));
    }

    return res.status(200).json(result.rows[0] || []);
  } catch (error) {
    return next(new ApiError("Server error while deleteReview", 500));
  }
};
