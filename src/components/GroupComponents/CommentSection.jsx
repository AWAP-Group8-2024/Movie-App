import { useEffect, useState } from "react";
import {
  getCommentsByPostId,
  createComment,
  deleteComment,
} from "../../services/GroupServices";
import { useNavigate } from "react-router-dom";

const CommentSection = ({ groupId, postId, userId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const fetchedComments = await getCommentsByPostId(groupId, postId);
        setComments(fetchedComments);
      } catch (err) {
        setError("Failed to fetch comments.");
      }
    };

    fetchComments();
  }, [groupId, postId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    setError(null);

    if (!newComment.trim()) {
      setError("Comment cannot be empty.");
      return;
    }

    try {
      const addedComment = await createComment(groupId, postId, newComment.trim());
      setComments([...comments, addedComment]);
      setNewComment("");
      navigate(0);
    } catch (err) {
      setError("Failed to add comment.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    setError(null);
    try {
      await deleteComment(groupId, postId, commentId);
      setComments(comments.filter((comment) => comment.id !== commentId));
    } catch (err) {
      setError("You are not authorized to delete this comment.");
    }
  };

  return (
    <div className="mt-4 p-4 bg-light rounded">
      <h5 className="mb-4">Comments</h5>
      {error && <div className="alert alert-danger">{error}</div>}

      <div
        className="list-group overflow-auto"
        style={comments.length > 2 ? {height: '225px'} : null}
      >
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="list-group-item mb-3 p-3 shadow-sm rounded"
          >
            <div className="d-flex justify-content-between align-items-center">
              <p className="mb-0">{comment.content}</p>
              {userId === comment.writer_id && (
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDeleteComment(comment.id)}
                >
                  Delete
                </button>
              )}
            </div>
            <small className="text-muted">
              Posted by {`${comment.firstname || ''} ${comment.lastname || ''}`.trim() || comment.writer_id} on{" "}
              {new Date(comment.creation_date).toLocaleString("en-US", {
								day: "numeric",
								month: "short",
								hour: "2-digit",
								minute: "2-digit",
							})}
            </small>
          </div>
        ))}
      </div>

      <form onSubmit={handleAddComment} className="mt-4">
        <div className="mb-3">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="form-control shadow-sm"
            rows="3"
            placeholder="Write a comment..."
          />
        </div>
        <button type="submit" className="btn btn-primary btn-sm shadow-sm">
          Add Comment
        </button>
      </form>
    </div>
  );
};

export default CommentSection;
