import React, { useState, useEffect } from "react";
import ReactStars from "react-rating-stars-component";
import { useUser } from "../UserComponents/UserProvider";
import "bootstrap-icons/font/bootstrap-icons.css";
import avatar from '../components/images/avatar.png';
import { formatDate } from "./utils.js";
import {ShareButton } from "../UserComponents/ProfileComponents/BodyComponents/UserInfoCardComponents/Button.jsx";

const url = process.env.REACT_APP_BACKEND_URL;

function Reviews({ movieId, loggedInUserId, movieTitle }) {
    const [reviews, setReviews] = useState([]);
    const [userReview, setUserReview] = useState(null);
    const [newReview, setNewReview] = useState({ text: "", rating: 0 });
    const [editingReview, setEditingReview] = useState(false);
    const { user } = useUser();
    const currentRating = 0;

    useEffect(() => {
        // Fetch reviews for the movie
        const fetchReviews = async () => {
            const response = await fetch(`${url}movie/reviews/${movieId}`);
            const data = await response.json();
            setReviews(data);

            // Check if the logged-in user has already reviewed

            /* const userReview = data.find((review) => review.user_id === loggedInUserId);
            setUserReview(userReview); */
        };

        fetchReviews();
    }, [movieId, loggedInUserId]);

    const handleEditReview = (review) => {
        setEditingReview(true);
        setUserReview(review);
        setNewReview({ text: review.description, rating: review.rating });
    };

    const handleDeleteReview = async (userReview) => {
        // Confirm delete action
        if (window.confirm("Are you sure you want to delete this review?")) {
            await fetch(`${url}/movie/reviews/${userReview}`, {
                method: "DELETE",
            });

            // Refresh reviews
            const response = await fetch(`${url}/movie/reviews/${movieId}`);
            const data = await response.json();
            setReviews(data);
        }
    };

    const handleReviewSubmit = async () => {
        if (userReview) {
            // Update review
            await fetch(`${url}/movie/editReview/${userReview.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ description: newReview.text, rating: newReview.rating }),
            });
        } else {
            // Post new review
            await fetch(`${url}/movie/addReview`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    movie_id: movieId,
                    user_id: loggedInUserId,
                    description: newReview.text,
                    rating: newReview.rating,
                    reviewer_email: user.email
                }),
            });
        }

        setNewReview({ text: "", rating: 0 });
        setEditingReview(false);
        // Refresh reviews
        const response = await fetch(`${url}/movie/reviews/${movieId}`);
        const data = await response.json();
        setReviews(data);
    };

    return (
        <div className="review-card">
            <h3>Reviews</h3>
            {reviews && reviews.length > 0 ? (
                reviews.map((review) => (
                    <div className="card mb-3 shadow-sm">
                        <div className="card-body">
                            <div className="d-flex mb-2 float-left" style={{ float: 'left' }}>
                                <div className="me-3">
                                    <img
                                        src={avatar}
                                        alt="User Avatar"
                                        className="rounded-circle"
                                        width="50"
                                        height="50"
                                    />
                                </div>
                                <div>
                                    <h6 className="mb-0"> {review.reviewer_email}</h6>
                                    <small className="text-muted">{formatDate(review.timestamp)}</small>
                                </div>
                            </div>
                            <div className="d-flex mb-2" style={{ float: 'right' }}>
                                <div className="me-2 ">

                                    <ReactStars
                                        count={5} // Total stars
                                        value={review.rating} // Current rating
                                        size={30} // Size of stars
                                        isHalf={true} // Allow half-stars
                                        activeColor="#ffd700"
                                        edit={false}
                                    />
                                </div>
                            </div>
                            <div className="clearfix"></div>
                            <p className="card-text">{review.description}</p>
                            {review.user_id === loggedInUserId && <span className="ms-auto">
                                <strong className="edit-review">(Your review)</strong>
                                <button
                                    onClick={() => handleEditReview(review)}
                                    className="btn btn-link text-primary"
                                    title="Edit"
                                >
                                    <i className="bi bi-pencil-square"></i>
                                </button>
                                <button
                                    onClick={() => handleDeleteReview(review.id)}
                                    className="btn btn-link text-danger"
                                    title="Delete"
                                >
                                    <i className="bi bi-trash"></i>
                                </button>
                            </span>
                            }
                            <div className="d-flex align-items-center" style={{ float: 'right' }}>
                                <span className="">
                                    <i className="bi bi-hand-thumbs-up"></i> 100
                                </span>
                                <span className="text-muted">&nbsp;&nbsp;Liked</span>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <p>No reviews available.</p>
            )}

            {/* Review Form */}
            {loggedInUserId && (
                <div>
                    <h3>{userReview ? `Edit Your Review ${movieTitle}` : `Be the first to review "${movieTitle}"`}</h3>

                    <h6 className="d-flex p-2">Your Rating &nbsp;<ReactStars
                        count={5} // Total stars
                        value={newReview.rating} // Current rating
                        onChange={(rating) => setNewReview({ ...newReview, rating })} // Update rating
                        size={30} // Size of stars
                        isHalf={true} // Allow half-stars
                        activeColor="#ffd700"
                    /></h6>


                    <form className="review-form" onSubmit={(e) => {
                        e.preventDefault();
                        handleReviewSubmit();
                    }}>
                        <div className="form-group mb-3">
                            <label className="form-label">Your review *</label>
                            <textarea rows="4" className="form-control" placeholder="Write your review here..." value={newReview.text}
                                onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}></textarea>
                        </div>

                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group mb-3">
                                    <label className="form-label">Email *</label>
                                    <input type="email" className="form-control" value={user.email} placeholder="Your email" disabled />
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary submit-btn"> {userReview ? "Update Review" : "Submit Review"}</button>
                    </form>

                </div>
            )}
        </div>
    );
}

export default Reviews;
