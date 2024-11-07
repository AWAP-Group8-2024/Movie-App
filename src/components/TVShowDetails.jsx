import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Navigation from './Navigation';

export default function TVShowDetails() {
    const { id } = useParams();
    const [show, setShow] = useState(null);

    useEffect(() => {
        fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`)
            .then((res) => res.json())
            .then((data) => setShow(data))
            .catch((error) => console.error("Error fetching TV show details:", error));
    }, [id]);

    if (!show) return (
        <div>
            <Navigation />
            <Container className="text-dark">Loading...</Container>
        </div>
    );

    return (
        <div>
            <Navigation />

            <Container className="text-dark my-5">
                <h1>{show.name}</h1>
                <h4>{new Date(show.first_air_date).getFullYear()}</h4>
                <Row>
                    <Col md={4}>
                        <img 
                            src={`https://image.tmdb.org/t/p/w500${show.poster_path}`} 
                            alt={show.name} 
                            className="img-fluid rounded"
                        />
                    </Col>
                    <Col md={8}>
                        <p><strong>First Air Date:</strong> {show.first_air_date}</p>
                        <p><strong>Overview:</strong> {show.overview}</p>
                        <p><strong>Genres:</strong> {show.genres?.map((genre) => genre.name).join(", ")}</p>
                        <p><strong>Rating:</strong> {show.vote_average}/10</p>
                        <p><strong>Number of Seasons:</strong> {show.number_of_seasons}</p>
                        <p><strong>Number of Episodes:</strong> {show.number_of_episodes}</p>
                        <p><strong>Status:</strong> {show.status}</p>
                        {show.last_air_date && (
                            <p><strong>Last Air Date:</strong> {show.last_air_date}</p>
                        )}
                    </Col>
                </Row>
            </Container>
        </div>
    );
}