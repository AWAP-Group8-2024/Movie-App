import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchShowAPI } from "./FetchAPI.jsx";

export default function PopularTVshows() {
    const [posterList, setPosterList] = useState(<Row>Loading...</Row>);

    useEffect(() => fetchShowAPI(`https://api.themoviedb.org/3/tv/popular?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&page=1`, setPosterList), []);

    return (
        <Container className="border border-1 border-dark rounded mt-5">
            <Row className="fs-4 row-cols-auto d-flex justify-content-between">
                <Col className="text-start fw-bold">
                    Popular TV shows
                </Col>
                <Col className="text-end text-decoration-none text-dark" as={Link} to={`/list/tv_popular?page=1`}>
                    {'View all ->'}
                </Col>
            </Row>
            
            {posterList}
        </Container>
    )
}