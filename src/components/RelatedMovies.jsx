import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';

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

function RelatedMovies({ movieId }) {
  const [relatedMovies, setRelatedMovies] = useState([]);

  useEffect(() => {
    const fetchRelatedMovies = async () => {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${process.env.REACT_APP_API_KEY}`
      );
      const data = await response.json();
      setRelatedMovies(data.results || []);
    };

    fetchRelatedMovies();
  }, [movieId]);

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

  if (!relatedMovies.length) return null;

  return (
    <div className="recommended-section">
      <h2>Recommended For You</h2>
      <div className="slider-container">
        <Slider {...settings}>
          {relatedMovies.map((movie) => (
            <div
              key={movie.id}
              className="show-card"
              onClick={() => window.location.href = `/movie/${movie.id}`}
            >
              <div className="show-poster-container">
                <img
                  src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                  alt={movie.title}
                  className="show-poster"
                />
                <div className="show-overlay">
                  <span>View Details</span>
                </div>
              </div>
              <div className="show-info-content">
                <h3 className="show-title">{movie.title}</h3>
                <p className="show-rating">
                  {movie.vote_average.toFixed(1)} / 10
                </p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}

export default RelatedMovies;