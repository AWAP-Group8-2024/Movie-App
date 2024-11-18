import { Col, Row } from "react-bootstrap";
import Navigation from "./Navigation";
import { useParams } from "react-router-dom";

export default function FinKinoMovieError() {
    const {id} = useParams();

    return (
        <div>
            <Navigation />
            <Row className='row-cols-auto justify-content-center'>
                <Col className="fs-3">
                    Couldn't find any info about the movie. But you can view it on
                    <a href={`http://www.finnkino.fi/event/${id}`}>FinnKino official website</a>
                </Col>
            </Row>
        </div>
    )
}