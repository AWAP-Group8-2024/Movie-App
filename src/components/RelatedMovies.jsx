import React, { useEffect, useState } from "react";
import Slider from "react-slick";

function RelatedMovies({ movieId }) {
  const [relatedMovies, setRelatedMovies] = useState([]);

  useEffect(() => {
    const fetchRelatedMovies = async () => {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${process.env.REACT_APP_API_KEY}`
      );
      const data = await response.json();
      setRelatedMovies(data.results);
    };

    fetchRelatedMovies();
  }, [movieId]);

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 600,
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

  return (
    <div>
      <h2>Recommended For You</h2>
      <br />
      <Slider {...sliderSettings}>
        {/* {console.log(relatedMovies)} */}
        {relatedMovies.map((movie) => (
          <div key={movie.id} style={{ padding: "10px", textAlign: "center" }}>
            <img
              src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
              alt={movie.title}
              style={{ borderRadius: "8px", maxWidth: "100%" }}
            />
            <p>{movie.title}</p>
            <p>{Math.round(movie.vote_average * 10) / 10} / 10</p>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default RelatedMovies;
