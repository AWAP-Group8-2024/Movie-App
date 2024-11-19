import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  addToFavorite,
  checkContentById,
} from "../Services/favoriteServices.js";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { FaEye, FaRegHeart, FaShare, FaRegBookmark } from "react-icons/fa";

import RelatedMovies from "./RelatedMovies.jsx";
import MovieCredits from "./MovieCredits.jsx";
import SocialSharing from "./SocialSharing.jsx";
import "./MovieDetail.css";
import { GoBookmark, GoBookmarkFill } from "react-icons/go";
import Navigation from "./Navigation";

function formatRuntime(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours} hr ${mins} mins`;
}

function renderStars(voteAverage) {
  const stars = Math.round(voteAverage / 2);
  return "★".repeat(stars) + "☆".repeat(5 - stars);
}

export default function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [contentInFavorite, setContentInFavorite] = useState(false);

  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
    )
      .then((res) => res.json())
      .then((data) => {
        setMovie(data);
        checkIfContentInFavoriteById(data);
      })
      .catch((error) => console.error("Error fetching movie details:", error));
  }, [id]);

  // const shareUrl = `${process.env.REACT_APP_API_URL}/movie/${id}`;
  // const shareMessage = `Check out "${movie.title}" on MovieApp!`;

  const checkIfContentInFavoriteById = async (movie) => {
    const isFavorite = await checkContentById(movie);
    setContentInFavorite(isFavorite);
  };

  const handleAddToFavorites = async () => {
    await addToFavorite(movie);
    setContentInFavorite(true);
  };

  if (!movie) return <Container className="text-dark">Loading...</Container>;
  return (
    <div>
      <Navigation />

      <Container className="movie-detail-container text-dark my-5">
        <Row>
          {/* Sticky Left Column */}
          <Col md={3} className="sticky-column">
            <div className="sticky-poster">
              <div className="movie-poster-container">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="movie-poster"
                />
                <div className="action-buttons">
                  <button className="action-btn">
                    <FaRegHeart /> <span>0</span>
                  </button>
                  <button
                    className="action-btn"
                    onClick={() => setShowShareOptions(!showShareOptions)}
                  >
                    <FaShare /> <span> Share</span>
                  </button>
                  <button className="action-btn" onClick={handleAddToFavorites}>
                    {contentInFavorite ? (
                      <>
                        <GoBookmarkFill /> <span>Favorites</span>
                      </>
                    ) : (
                      <>
                        <GoBookmark /> <span>Favorites</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="social-buttons">
                  {showShareOptions && (
                    <SocialSharing url={"localhost"} message={movie.title} />
                  )}
                </div>
              </div>
            </div>
          </Col>

          <Col md={9}>
            <div className="movie-info">
              <h1>
                {movie.title} ({new Date(movie.release_date).getFullYear()})
              </h1>

              <div className="movie-meta">
                <div className="rating-stars">
                  {renderStars(movie.vote_average)} (
                  {movie.vote_average.toFixed(1)}/10)
                </div>

                <div className="cont-movie-details">
                  <span>{new Date(movie.release_date).getFullYear()}</span>
                  <span>{formatRuntime(movie.runtime)}</span>
                  <span>{movie.origin_country}</span>
                </div>

                <div className="genres">
                  {movie.genres.map((genre) => (
                    <span key={genre.id} className="genre">
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>

              <p className="synopsis">{movie.overview}</p>

              <div className="cast-crew">{<MovieCredits movieId={id} />}</div>
            </div>

            <section className="recommended-section">
              <div className="recommended-movies">
                <RelatedMovies movieId={id} />
              </div>
            </section>

            <section className="review-section">
              <h3>Be the first to review "{movie.title}"</h3>
              <Form className="review-form">
                <Form.Group className="mb-3">
                  <Form.Label>Your review *</Form.Label>
                  <Form.Control as="textarea" rows={4} className="" />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Name *</Form.Label>
                      <Form.Control type="text" className="" />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email *</Form.Label>
                      <Form.Control type="email" className="" />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Save my name, email, and website in this browser for the next time I comment."
                    className="text-light"
                  />
                </Form.Group>

                <Button variant="primary" className="submit-btn">
                  Submit
                </Button>
              </Form>
            </section>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
