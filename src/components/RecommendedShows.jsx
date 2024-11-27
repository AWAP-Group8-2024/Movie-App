import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import "./RecommendedShows.css";

const CustomNextArrow = ({ onClick }) => (
  <div className="custom-arrow custom-next" onClick={onClick}>
    <FaArrowRight />
  </div>
);

const CustomPrevArrow = ({ onClick }) => (
  <div className="custom-arrow custom-prev" onClick={onClick}>
    <FaArrowLeft />
  </div>
);

function RecommendedShows({ showId }) {
  const [relatedShows, setRelatedShows] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRelatedShows = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/tv/${showId}/recommendations?api_key=${process.env.REACT_APP_TMDB_API_KEY}`
        );
        const data = await response.json();
        setRelatedShows(data.results || []);
      } catch (error) {
        console.error("Error fetching related shows:", error);
      }
    };

    fetchRelatedShows();
  }, [showId]);

  const handleShowClick = (showId) => {
    navigate(`/tv/${showId}`);
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 600,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  if (!relatedShows.length) return null;

  return (
    <div className="recommended-section">
      <h2>Recommended For You</h2>
      <div className="slider-container">
        <Slider {...settings}>
          {relatedShows.map((show) => (
            <div
              key={show.id}
              className="show-card"
              onClick={() => handleShowClick(show.id)}
            >
              <div className="show-poster-container">
                <img
                  src={`https://image.tmdb.org/t/p/w300${show.poster_path}`}
                  alt={show.name}
                  className="show-poster"
                />
                <div className="show-overlay">
                  <span>View Details</span>
                </div>
              </div>
              <div className="show-info-content">
                <h3 className="show-title">{show.name}</h3>
                <p className="show-rating">
                  {show.vote_average.toFixed(1)} / 10
                </p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}

export default RecommendedShows;