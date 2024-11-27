import { Row, Col, Container } from "react-bootstrap";
import { movieGenres } from "./movieGenres";
import Navigation from "./Navigation";
import { Link } from "react-router-dom";

export default function ListGenres() {
    function createBody() {
        let body = [];
        let row = [];
        for (let i = 0; i < Math.ceil(movieGenres.length / 4); i++) {
            row = [];
            for (let n = 0; n < 4; n++) {
                if (movieGenres[i * 4 + n]) {
                    row.push(
                        <Col key={i * 4 + n} xs={6} md={3} className='text-decoration-none text-dark p-2 fw-bold fs-4'  as={Link} to={`/filtered/movie?genres=${movieGenres[i * 4 + n].id}&page=1`}>
                            <div className='border border-1 border-dark rounded p-2 h-100 d-flex align-items-center justify-content-center text-center'>
                                {movieGenres[i * 4 + n].name}
                            </div>
                        </Col>
                    );
                    
                }
            }
            body.push(
                <Row key={i} className="d-flex justify-content-around mb-3 flex-grow-1">
                    {row}
                </Row>
            );
        }
        return body;
    }

    return (
        <div className="vh-100 d-flex d-grow-1 flex-column">
            <Navigation />
            <h1 className="text-center mb-3"><b>Genres</b></h1>
            <Container className="w-100 h-100 d-flex flex-column">
                {createBody()}
            </Container>
        </div>
    )
}