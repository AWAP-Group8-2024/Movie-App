import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchMovieAPI } from "./FetchAPI.jsx";

export default function TrendingMovies() {
    const [posterList, setPosterList] = useState(<Row>Loading...</Row>);

    useEffect(() => fetchMovieAPI(`https://api.themoviedb.org/3/trending/movie/week?api_key=${process.env.REACT_APP_API_KEY}`, setPosterList), []);

    return (
        <Container className="border border-1 border-dark rounded mt-5">
            <Row className="fs-4 row-cols-auto d-flex justify-content-between">
                <Col className="text-start fw-bold">
                    Trending movies
                </Col>
                <Col className="text-end text-decoration-none text-dark" as={Link} to={`/list/trending_movie_week?page=1`}>
                    {'View all ->'}
                </Col>
            </Row>
            
            {posterList}
        </Container>
    )
}