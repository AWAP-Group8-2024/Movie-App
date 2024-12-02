import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { FaEye, FaStar, FaShare } from "react-icons/fa";

import RelatedMovies from "./RelatedMovies.jsx";
import MovieCredits from "./MovieCredits.jsx";
import SocialSharing from "./SocialSharing.jsx";
import "./MovieDetail.css";
import { GoBookmark, GoBookmarkFill } from "react-icons/go";
import Navigation from "./Navigation";
import { useUser } from "../UserComponents/UserProvider";
import { formatRuntime, renderStars } from "./utils.js";
import FinnKinoSchedule from "./FinnKinoSchedule.jsx";
import { useFavorite } from "../UserComponents/FavoriteProvider";
import Reviews from "./Reviews.jsx";

export default function MovieDetails() {
  const { mediaType, id } = useParams();
  const [movie, setMovie] = useState(null);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const { user } = useUser();
  const {
    checkContentById,
    contentInFavorite,
    setContentInFavorite,
    addToFavorite,
    removeFromFavorite,
  } = useFavorite();

  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US`
    )
      .then((res) => res.json())
      .then((data) => {
        setMovie(data);
      })
      .catch((error) => console.error("Error fetching movie details:", error));
  }, [id]);

  useEffect(() => {
    if (!user) {
      setContentInFavorite(false);
    }
  }, [user, setContentInFavorite]);

  const handleToggleFavorite = async () => {
    if (!user.token) {
      alert("Please log in to add or remove content from your favorites.");
      return;
    }
    try {
      if (contentInFavorite) {
        await removeFromFavorite(movie);
        setContentInFavorite(false);
      } else {
        await addToFavorite(movie, mediaType);
        setContentInFavorite(true);
      }
    } catch (error) {
      console.error("Error toggling favorite status:", error);
      alert("An error occurred. Please try again.");
    }
  };

    const [shareUrl, setShareUrl] = useState("");
  
    useEffect(() => {
      setShareUrl(window.location.href);
    }, []);

  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      if (!user?.token || !movie) return;

      try {
        const isFavorite = await checkContentById(movie);
        setContentInFavorite(!!isFavorite);
      } catch (error) {
        console.error("Error fetching favorite status:", error);
      }
    };

    fetchFavoriteStatus();
  }, [user, movie, checkContentById, setContentInFavorite]);

 

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
                  <button
                    className="action-btn"
                    onClick={() => setShowShareOptions(!showShareOptions)}
                  >
                    <FaShare /> <span> Share</span>
                  </button>
                  <button className="action-btn" onClick={handleToggleFavorite}>
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
                    <SocialSharing shareUrl={shareUrl} message={movie.title} movie={movie} />
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
              <div className="tmdb-rating">
                    <FaStar className="star-icon" />
                    <span>{movie.vote_average?.toFixed(1)}/10</span>
                  </div>

                  <span className="views">
                    <FaEye /> {Math.round(movie.popularity)} Views
                  </span>

                <div className="clearfix"></div>
                <br/>
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

              <div className="overview">
                <h3>Overview</h3>
                <p>{movie.overview}</p>
              </div>

              <div className="cast-crew">{<MovieCredits movieId={id} />}</div>
            </div>

            <FinnKinoSchedule dataTMDB={movie} />

            <section className="recommended-section">
              <div className="recommended-movies">
                <RelatedMovies movieId={id} />
              </div>
            </section>

            <section className="review-section">
              <Reviews movieId={id} loggedInUserId={user.id} movieTitle={movie.title} />
            </section>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
