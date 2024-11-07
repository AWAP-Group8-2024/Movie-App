// TVShowDetails.jsx
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Alert } from 'react-bootstrap';
import Navigation from './Navigation';

export default function TVShowDetails() {
    const { id } = useParams();
    const [show, setShow] = useState(null);
    const [selectedSeason, setSelectedSeason] = useState(null);
    const [seasonDetails, setSeasonDetails] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`)
            .then((res) => res.json())
            .then((data) => setShow(data))
            .catch((error) => {
                console.error("Error fetching TV show details:", error);
                setError("No details available in TMDB for this show.");
            });
    }, [id]);

    const fetchSeasonDetails = (seasonNumber) => {
        fetch(`https://api.themoviedb.org/3/tv/${id}/season/${seasonNumber}?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`)
            .then((res) => res.json())
            .then((data) => {
                if (!data.poster_path && !data.overview) {
                    setError("No details available in TMDB for this season.");
                    return;
                }
                setSeasonDetails(data);
                setSelectedSeason(seasonNumber);
                setError(null);
            })
            .catch(() => {
                setError("No details available in TMDB for this season.");
            });
    };

    if (!show) return (
        <div>
            <Navigation />
            <Container className="text-dark">Loading...</Container>
        </div>
    );

    const renderSeasonsList = () => {
        // Filter seasons that have poster_path and aren't season 0
        const availableSeasons = show.seasons?.filter(season => 
            season.season_number !== 0 && season.poster_path
        );

        if (!availableSeasons || availableSeasons.length === 0) {
            return (
                <Alert variant="info" className="mt-4">
                    No season details available in TMDB for this show.
                </Alert>
            );
        }

        return (
            <Row className="mt-4">
                <Col>
                    <h2 className="mb-4">Seasons</h2>
                    <Row>
                        {availableSeasons.map((season) => (
                            <Col key={season.id} xs={6} sm={4} md={3} className="mb-4">
                                <div 
                                    className="card h-100" 
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => fetchSeasonDetails(season.season_number)}
                                >
                                    <img
                                        src={`https://image.tmdb.org/t/p/w300${season.poster_path}`}
                                        className="card-img-top"
                                        alt={`Season ${season.season_number}`}
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title">Season {season.season_number}</h5>
                                    </div>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Col>
            </Row>
        );
    };

    const renderSeasonDetails = () => {
        if (error) {
            return (
                <div className="mt-4">
                    <Button 
                        variant="secondary" 
                        className="mb-4"
                        onClick={() => {
                            setSelectedSeason(null);
                            setSeasonDetails(null);
                            setError(null);
                        }}
                    >
                        ← Back to Seasons
                    </Button>
                    <Alert variant="info">
                        {error}
                    </Alert>
                </div>
            );
        }

        if (!seasonDetails) return <div>Loading season details...</div>;

        return (
            <div className="mt-4">
                <Button 
                    variant="secondary" 
                    className="mb-4"
                    onClick={() => {
                        setSelectedSeason(null);
                        setSeasonDetails(null);
                        setError(null);
                    }}
                >
                    ← Back to Seasons
                </Button>
                <Row>
                    <Col md={4}>
                        <img
                            src={`https://image.tmdb.org/t/p/w500${seasonDetails.poster_path}`}
                            alt={seasonDetails.name}
                            className="img-fluid rounded"
                        />
                    </Col>
                    <Col md={8}>
                        <h2>{seasonDetails.name}</h2>
                        <p><strong>First Air Date:</strong> {seasonDetails.air_date}</p>
                        <p><strong>Overview:</strong> {seasonDetails.overview}</p>
                        <p><strong>Episodes:</strong> {seasonDetails.episodes?.length}</p>
                        <p><strong>Rating:</strong> {seasonDetails.vote_average?.toFixed(1)}/10</p>
                    </Col>
                </Row>
            </div>
        );
    };

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

                {selectedSeason ? renderSeasonDetails() : renderSeasonsList()}
            </Container>
        </div>
    );
}