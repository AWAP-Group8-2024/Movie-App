import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import "./RecommendedShows.css"; // Assuming you have a CSS file for this component

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

  useEffect(() => {
    const fetchRelatedShows = async () => {
      const response = await fetch(
        `https://api.themoviedb.org/3/tv/${showId}/recommendations?api_key=${process.env.REACT_APP_API_KEY}`
      );
      const data = await response.json();
      setRelatedShows(data.results || []);
    };

    fetchRelatedShows();
  }, [showId]);

  const settings = {
    dots: false, // Hide default dots
    infinite: true, // Enable looping
    speed: 600, // Smooth transition speed
    slidesToShow: 4, // Number of visible slides
    slidesToScroll: 1, // Scroll one slide at a time
    arrows: true, // Enable custom arrows
    autoplay: true, // Automatically cycle through slides
    autoplaySpeed: 3000, // Delay between transitions
    pauseOnHover: true, // Pause autoplay on hover
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
              onClick={() => (window.location.href = `/tv/${show.id}`)}
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