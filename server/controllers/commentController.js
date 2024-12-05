import { insertComment, getCommentsForPost, deleteComment, updateComment, getCommentsByUser, getCommentById } from "../models/Comment.js";
// import { ApiError } from "../helpers/apiError.js";
// Create a new comment
export const createComment = async (req, res, next) => {
    const { content } = req.body;
    const { postId } = req.params;

    const accountId = req.user.id; // Assuming user ID is stored in request (e.g., from authentication middleware)

    try {
        const newComment = await insertComment(postId, accountId, content);
        res.status(201).json({ message: "Comment created successfully", comment: newComment });
    } catch (error) {
        next(error); // Pass the error to the error handler
    }
};

// Get all comments for a specific post
export const getComments = async (req, res, next) => {
    const { postId } = req.params;

    try {
        const comments = await getCommentsForPost(postId);
        res.status(200).json(comments);
    } catch (error) {
        next(error);
    }
};

// Delete a comment
export const removeComment = async (req, res, next) => {
    const { commentId } = req.params;
    const userId = req.user.id; // Assuming user ID is stored in request (e.g., from authentication middleware)

    try {
        const deletedComment = await deleteComment(commentId, userId);
        res.status(200).json({ message: "Comment deleted successfully", comment: deletedComment });
    } catch (error) {
        next(error);
    }
};

// Update a comment
export const editComment = async (req, res, next) => {
    const { commentId } = req.params;
    const userId = req.user.id; // Assuming user ID is stored in request (e.g., from authentication middleware)
    const { newContent } = req.body;

    try {
        const updatedComment = await updateComment(commentId, userId, newContent);
        res.status(200).json({ message: "Comment updated successfully", comment: updatedComment });
    } catch (error) {
        next(error);
    }
};

// Get all comments by a specific user
export const getUserComments = async (req, res, next) => {
    const userId = req.user.id; // Assuming user ID is stored in request

    try {
        const comments = await getCommentsByUser(userId);
        res.status(200).json(comments);
    } catch (error) {
        next(error);
    }
};

// Get a specific comment by ID
export const getSingleComment = async (req, res, next) => {
    const { commentId } = req.params;

    try {
        const comment = await getCommentById(commentId);
        res.status(200).json(comment);
    } catch (error) {
        next(error);
    }
};
