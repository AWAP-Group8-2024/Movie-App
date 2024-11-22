import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { FaEye, FaStar, FaRegHeart, FaShare } from "react-icons/fa";
import Navigation from "./Navigation";
import TVShowCredits from "./TVShowCredits";
import RecommendedShows from "./RecommendedShows";
import SocialSharing from "./SocialSharing";
import "./TVShowDetails.css";
import { useUser } from "../UserComponents/UseUser.jsx";
import { GoBookmark, GoBookmarkFill } from "react-icons/go";
import { useFavorite } from "../UserComponents/FavoriteProvider";

export default function TVShowDetails() {
  const { mediaType, id } = useParams();
  const [show, setShow] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [seasonDetails, setSeasonDetails] = useState(null);
  const [error, setError] = useState(null);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
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
      `https://api.themoviedb.org/3/tv/${id}?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
    )
      .then((res) => res.json())
      .then((data) => {
        setShow(data);
      })
      .catch((error) => {
        console.error("Error fetching TV show details:", error);
        setError("No details available in TMDB for this show.");
      });
  }, [id]);

  const fetchSeasonDetails = (seasonNumber) => {
    fetch(
      `https://api.themoviedb.org/3/tv/${id}/season/${seasonNumber}?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
    )
      .then((res) => res.json())
      .then((data) => {
        if (!data.poster_path && !data.overview) {
          setError("No details available in TMDB for this season.");
          return;
        }
        setSeasonDetails(data);
        setSelectedSeason(seasonNumber);
        setError(null);
      })
      .catch(() => {
        setError("No details available in TMDB for this season.");
      });
  };

  const handleToggleFavorite = async () => {
    if (!user.token) {
      alert("Please log in to add or remove content from your favorites.");
      return;
    }
    try {
      if (contentInFavorite) {
        await removeFromFavorite(show);
        setContentInFavorite(false);
      } else {
        await addToFavorite(show, mediaType);
        setContentInFavorite(true);
      }
    } catch (error) {
      console.error("Error toggling favorite status:", error);
      alert("An error occurred. Please try again.");
    }
  };

  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      if (!user?.token || !show) return;

      try {
        const isFavorite = await checkContentById(show);
        setContentInFavorite(!!isFavorite);
      } catch (error) {
        console.error("Error fetching favorite status:", error);
      }
    };

    fetchFavoriteStatus();
  }, [user, show, checkContentById, setContentInFavorite]);

  if (!show)
    return (
      <div>
        <Navigation />
        <Container className="loading-container">
          <div className="loader">Loading...</div>
        </Container>
      </div>
    );

  const renderRatingStars = () => {
    return (
      <div className="star-rating">
        {[...Array(5)].map((star, index) => {
          const ratingValue = index + 1;
          return (
            <label key={index}>
              <input
                type="radio"
                name="rating"
                value={ratingValue}
                onClick={() => setRating(ratingValue)}
              />
              <FaStar
                className="star"
                size={20}
                color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                onMouseEnter={() => setHover(ratingValue)}
                onMouseLeave={() => setHover(0)}
              />
            </label>
          );
        })}
      </div>
    );
  };

  const renderSeasonsList = () => {
    const availableSeasons = show.seasons?.filter(
      (season) => season.season_number !== 0 && season.poster_path
    );

    if (!availableSeasons || availableSeasons.length === 0) {
      return (
        <Alert variant="info" className="mt-4">
          No season details available in TMDB for this show.
        </Alert>
      );
    }

    return (
      <section className="seasons-section">
        <h2>Seasons</h2>
        <Row className="seasons-grid">
          {availableSeasons.map((season) => (
            <Col key={season.id} xs={6} sm={4} md={3} className="mb-4">
              <div
                className="season-card"
                onClick={() => fetchSeasonDetails(season.season_number)}
              >
                <div className="season-poster">
                  <img
                    src={`https://image.tmdb.org/t/p/w300${season.poster_path}`}
                    alt={`Season ${season.season_number}`}
                  />
                  <div className="season-overlay">
                    <span>View Details</span>
                  </div>
                </div>
                <div className="season-info">
                  <h5>Season {season.season_number}</h5>
                  <p>{season.episode_count} Episodes</p>
                  {season.air_date && (
                    <p className="air-date">
                      {new Date(season.air_date).getFullYear()}
                    </p>
                  )}
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </section>
    );
  };

  const renderSeasonDetails = () => {
    if (error) {
      return (
        <div className="season-details-error">
          <Button
            variant="secondary"
            onClick={() => {
              setSelectedSeason(null);
              setSeasonDetails(null);
              setError(null);
            }}
          >
            ← Back to Seasons
          </Button>
          <Alert variant="info" className="mt-3">
            {error}
          </Alert>
        </div>
      );
    }

    if (!seasonDetails)
      return <div className="loader">Loading season details...</div>;

    if (!seasonDetails.episodes || seasonDetails.episodes.length === 0) {
      return (
        <div className="season-details">
          <Button
            variant="secondary"
            className="back-button"
            onClick={() => {
              setSelectedSeason(null);
              setSeasonDetails(null);
              setError(null);
            }}
          >
            ← Back to Seasons
          </Button>
          <Alert variant="info" className="mt-3">
            No season details available in TMDB for this show.
          </Alert>
        </div>
      );
    }

    return (
      <div className="season-details">
        <Button
          variant="secondary"
          className="back-button"
          onClick={() => {
            setSelectedSeason(null);
            setSeasonDetails(null);
            setError(null);
          }}
        >
          ← Back to Seasons
        </Button>
        <Row className="mt-4">
          <Col md={4}>
            <img
              src={`https://image.tmdb.org/t/p/w500${seasonDetails.poster_path}`}
              alt={seasonDetails.name}
              className="season-detail-poster"
            />
          </Col>
          <Col md={8}>
            <div className="season-detail-info">
              <h2>{seasonDetails.name}</h2>
              <div className="season-meta">
                <span>
                  {seasonDetails.air_date &&
                    new Date(seasonDetails.air_date).getFullYear()}
                </span>
                <span>{seasonDetails.episodes.length} Episodes</span>
              </div>
              <p className="season-overview">{seasonDetails.overview}</p>
              <div className="episodes-list">
                <h3>Episodes</h3>
                <div className="episodes-grid">
                  {seasonDetails.episodes.map((episode) => (
                    <div key={episode.id} className="episode-card">
                      <div className="episode-number">
                        Episode {episode.episode_number}
                      </div>
                      <h4>{episode.name}</h4>
                      <p>
                        {episode.overview ||
                          "No information available for this episode on TMDB."}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    );
  };

  return (
    <div className="tvshow-details-page">
      <Navigation />
      <Container className="tvshow-detail-container">
        <Row>
          <Col md={3} className="sticky-column">
            <div className="sticky-poster">
              <div className="poster-container">
                <img
                  src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                  alt={show.name}
                  className="show-poster"
                />
                <div className="action-buttons">
                  <button className="action-btn">
                    <FaRegHeart /> <span>0</span>
                  </button>
                  <button
                    className="action-btn"
                    onClick={() => setShowShareOptions(!showShareOptions)}
                  >
                    <FaShare /> <span>Share</span>
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
                {showShareOptions && (
                  <div className="social-buttons">
                    <SocialSharing
                      url={window.location.href}
                      message={show.name}
                    />
                  </div>
                )}
              </div>
            </div>
          </Col>

          <Col md={9}>
            <div className="show-info">
              <h1>
                {show.name}{" "}
                <span className="year">
                  ({new Date(show.first_air_date).getFullYear()})
                </span>
              </h1>

              <div className="show-meta">
                <div className="rating-stats">
                  <div className="tmdb-rating">
                    <FaStar className="star-icon" />
                    <span>{show.vote_average?.toFixed(1)}/10</span>
                  </div>
                  <span className="views">
                    <FaEye /> {Math.round(show.popularity)} Views
                  </span>
                </div>

                <div className="show-details">
                  <span>{new Date(show.first_air_date).getFullYear()}</span>
                  <span>
                    {show.number_of_seasons} Season
                    {show.number_of_seasons !== 1 ? "s" : ""}
                  </span>
                  <span>{show.status}</span>
                </div>

                <div className="genres">
                  {show.genres?.map((genre) => (
                    <span key={genre.id} className="genre">
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="overview">
                <h3>Overview</h3>
                <p>{show.overview}</p>
              </div>

              <div className="show-details-grid">
                <div className="detail-item">
                  <label>Network</label>
                  <span>{show.networks?.[0]?.name || "N/A"}</span>
                </div>
                <div className="detail-item">
                  <label>Status</label>
                  <span>{show.status}</span>
                </div>
                <div className="detail-item">
                  <label>Original Language</label>
                  <span>{show.original_language?.toUpperCase()}</span>
                </div>
                <div className="detail-item">
                  <label>Total Episodes</label>
                  <span>{show.number_of_episodes}</span>
                </div>
              </div>

              <div className="cast-crew">
                <TVShowCredits showId={id} />
              </div>

              {selectedSeason ? renderSeasonDetails() : renderSeasonsList()}

              <div className="recommended-section">
                <RecommendedShows showId={id} />
              </div>

              <section className="review-section">
                <h3>Add Your Review</h3>
                <Form className="review-form">
                  <Form.Group className="mb-4">
                    <Form.Label>Your Rating</Form.Label>
                    {renderRatingStars()}
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Your Review</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      placeholder="Write your review here..."
                      className="dark-textarea"
                    />
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Your name"
                          className="dark-input"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          placeholder="Your email"
                          className="dark-input"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-4">
                    <Form.Check
                      type="checkbox"
                      label="Save my information for next time"
                      id="save-info"
                    />
                  </Form.Group>

                  <Button variant="primary" className="submit-btn">
                    Submit Review
                  </Button>
                </Form>
              </section>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
