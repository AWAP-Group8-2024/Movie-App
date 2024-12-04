import { useState, useEffect } from "react";
import { Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { formatePostContentId } from "../../services/GroupServices";

export default function GroupPostMoviePoster({ contentId }) {
    const [movie, setMovie] = useState('');

    const formateContentId = () => formatePostContentId(contentId);

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
            xs={5}
            md={3}
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