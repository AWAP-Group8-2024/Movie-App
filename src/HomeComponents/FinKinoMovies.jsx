import { useState, useEffect } from "react";
import { fetchFinKinoEvents } from "./FetchAPI";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function FinKinoMovies() {
    const [posterList, setPosterList] = useState(<Row>Loading...</Row>);

    useEffect(() => {fetchFinKinoEvents(`https://www.finnkino.fi/xml/Events/`, setPosterList)}, []);

    return (
        <Container className="border border-1 border-dark rounded mt-5 mb-5">
            <Row className="fs-4 row-cols-auto d-flex justify-content-between">
                <Col className="text-start fw-bold">
                    Watch in FinKino
                </Col>
                <Col className="text-end text-decoration-none text-dark" as={Link} to={`/finnkino/list?page=1`}>
                    {'View all ->'}
                </Col>
            </Row>
            
            {posterList}
        </Container>
    )
}