import { pool } from "../helpers/db.js"; // Assuming you have a DB connection helper
import { ApiError } from "../helpers/apiError.js";

// Insert a new comment
export const insertComment = async (postId, accountId, content) => {
    try {
        const result = await pool.query(
            "INSERT INTO comment (post_id, writer_id, content) VALUES ($1, $2, $3) RETURNING *",
            [postId, accountId, content]
        );
        return result.rows[0]; // Return the inserted comment
    } catch (error) {
        console.error('Error during comment insertion:', error);
        throw new ApiError("Internal server error while inserting comment.", 500);
    }
};

// Get all comments for a specific post
export const getCommentsForPost = async (postId) => {
    try {
        const query = `
            SELECT c.id, c.writer_id, c.content, c.creation_date, a.firstname, a.lastname
            FROM comment c
            JOIN account a ON c.writer_id = a.id
            WHERE c.post_id = $1
            ORDER BY c.creation_date ASC;
        `;
        const { rows } = await pool.query(query, [postId]);
        return rows; // Return the list of comments
    } catch (error) {
        throw new ApiError("Internal server error while fetching comments.", 500);
    }
};

// Delete a comment
export const deleteComment = async (commentId, userId) => {
    try {
        const query = `
            DELETE FROM comment
            WHERE id = $1 AND writer_id = $2
            RETURNING *;
        `;
        const { rows } = await pool.query(query, [commentId, userId]);
        if (rows.length === 0) {
            throw new ApiError("Comment not found or you're not authorized to delete it.", 404);
        }
        return rows[0]; // Return the deleted comment
    } catch (error) {
        throw new ApiError("Internal server error while deleting comment.", 500);
    }
};

// Update a comment
export const updateComment = async (commentId, userId, newContent) => {
    try {
        const query = `
            UPDATE comment
            SET content = $1
            WHERE id = $2 AND writer_id = $3
            RETURNING *;
        `;
        const { rows } = await pool.query(query, [newContent, commentId, userId]);
        if (rows.length === 0) {
            throw new ApiError("Comment not found or you're not authorized to update it.", 404);
        }
        return rows[0]; // Return the updated comment
    } catch (error) {
        throw new ApiError("Internal server error while updating comment.", 500);
    }
};

// Get all comments by a specific user
export const getCommentsByUser = async (userId) => {
    try {
        const query = `
            SELECT c.id, c.content, c.creation_date, p.description AS post_description
            FROM comment c
            JOIN group_post p ON c.post_id = p.post_id
            WHERE c.writer_id = $1
            ORDER BY c.creation_date DESC;
        `;
        const { rows } = await pool.query(query, [userId]);
        return rows; // Return the list of comments by the user
    } catch (error) {
        throw new ApiError("Internal server error while fetching user's comments.", 500);
    }
};

// Get details of a specific comment
export const getCommentById = async (commentId) => {
    try {
        const query = `
            SELECT c.id, c.content, c.creation_date, a.firstname, a.lastname, p.description AS post_description
            FROM comment c
            JOIN account a ON c.writer_id = a.id
            JOIN group_post p ON c.post_id = p.post_id
            WHERE c.id = $1;
        `;
        const { rows } = await pool.query(query, [commentId]);
        if (rows.length === 0) {
            throw new ApiError("Comment not found.", 404);
        }
        return rows[0]; // Return the comment details
    } catch (error) {
        throw new ApiError("Internal server error while fetching comment details.", 500);
    }
};
