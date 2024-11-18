import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    initialSlide: 0,
    accessibility: true,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: false,
          dots: true
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  if (!relatedShows.length) return null;

  return (
    <div className="recommended-section">
      <h2>Recommended For You</h2>
      <div className="slider-container">
        <Slider {...settings}>
          {relatedShows.map((show) => (
            <div key={show.id} className="show-card">
              <div className="show-card-inner">
                <img
                  src={`https://image.tmdb.org/t/p/w300${show.poster_path}`}
                  alt={show.name}
                  className="show-poster"
                />
                <h3 className="show-title">{show.name}</h3>
                <p className="show-rating">{show.vote_average.toFixed(1)} / 10</p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}

export default RecommendedShows;