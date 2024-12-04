import { useState, useEffect } from "react";
import { Col } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function GroupPostMoviePoster({ contentId }) {
    const [movie, setMovie] = useState('');

    function formateContentId() {
        if (contentId[0] === 'm') {
            return {
                media_type: 'movie',
                id: contentId.replace('m', '')
            }
        } else {
            return {
                media_type: 'tv',
                id: contentId.replace('t', '')
            }
        }
    }

    function getPoster() {
        fetch(`https://api.themoviedb.org/3/${formateContentId().media_type}/${formateContentId().id}?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US`)
        .then(res => res.json())
        .then(json => {
            setMovie(json);
        })
    }

    useEffect(getPoster, []);

    return (
        <Col
            xs={3}
            className="text-center text-decoration-none text-dark"
            as={Link}
            to={`/${formateContentId().media_type}/${formateContentId().id}`}
        >
            <img
                alt=""
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                className="img-fluid rounded"
            />
            {movie.title || movie.name}
        </Col>
    )
}