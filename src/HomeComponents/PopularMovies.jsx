import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchMovieAPI } from "./FetchAPI.jsx";

export default function PopularMovies() {
    const [posterList, setPosterList] = useState(<Row>Loading...</Row>);

    useEffect(() => fetchMovieAPI(`https://api.themoviedb.org/3/movie/popular?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&page=1`, setPosterList), []);

    return (
        <Container className="border border-1 border-dark rounded mt-5">
            <Row className="fs-4 row-cols-auto d-flex justify-content-between">
                <Col className="text-start fw-bold">
                    Popular movies
                </Col>
                <Col className="text-end text-decoration-none text-dark" as={Link}>
                    {'View all ->'}
                </Col>
            </Row>
            
            {posterList}
        </Container>
    )
}