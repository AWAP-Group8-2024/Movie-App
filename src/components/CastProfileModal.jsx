import React, { useState, useEffect } from 'react';
import { Modal, Button, Row, Col, Nav, Tab } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './CastProfile.css';

const CastProfileModal = ({ personId, show, onHide }) => {
  const [profile, setProfile] = useState(null);
  const [credits, setCredits] = useState({ movies: [], tvShows: [] });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (personId) {
      Promise.all([
        fetch(`https://api.themoviedb.org/3/person/${personId}?api_key=${process.env.REACT_APP_TMDB_API_KEY}`),
        fetch(`https://api.themoviedb.org/3/person/${personId}/combined_credits?api_key=${process.env.REACT_APP_TMDB_API_KEY}`)
      ])
        .then(([profileRes, creditsRes]) => Promise.all([profileRes.json(), creditsRes.json()]))
        .then(([profileData, creditsData]) => {
          setProfile(profileData);
          
          const sortedCredits = {
            movies: creditsData.cast
              .filter(credit => credit.media_type === 'movie' && credit.poster_path)
              .sort((a, b) => b.popularity - a.popularity),
            tvShows: creditsData.cast
              .filter(credit => credit.media_type === 'tv' && credit.poster_path)
              .sort((a, b) => b.popularity - a.popularity)
          };
          
          setCredits(sortedCredits);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching person details:', error);
          setLoading(false);
        });
    }
  }, [personId]);

  const handleMediaClick = (media, mediaType) => {
    onHide();
    navigate(`/${mediaType}/${media.id}`);
  };

  const calculateAge = (birthday) => {
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const renderMediaPosters = (mediaList, type) => {
    return (
      <div className="media-grid">
        {mediaList.map(media => (
          <div 
            key={media.id} 
            className="media-item" 
            onClick={() => handleMediaClick(media, type)}
            role="button"
            tabIndex={0}
          >
            <div className="poster-container">
              <img
                src={`https://image.tmdb.org/t/p/w185${media.poster_path}`}
                alt={media.title || media.name}
                className="media-poster"
              />
              <div className="poster-overlay">
                <div className="poster-content">
                  <h6>{media.title || media.name}</h6>
                  <p>{media.character && `as ${media.character}`}</p>
                  <p>{type === 'movie' 
                    ? (media.release_date && new Date(media.release_date).getFullYear()) 
                    : (media.first_air_date && new Date(media.first_air_date).getFullYear())}
                  </p>
                  <div className="view-details-button">
                    View Details
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <Modal show={show} onHide={onHide} size="lg" centered>
        <Modal.Body className="text-center py-5">Loading...</Modal.Body>
      </Modal>
    );
  }

  if (!profile) return null;

  return (
    <Modal show={show} onHide={onHide} size="xl" centered className="cast-profile-modal">
      <Modal.Header closeButton>
        <Modal.Title>{profile.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col md={3}>
            <div className="profile-image-container">
              <img
                src={profile.profile_path 
                  ? `https://image.tmdb.org/t/p/w300${profile.profile_path}`
                  : 'placeholder-image-url'}
                alt={profile.name}
                className="profile-image"
              />
            </div>

            <div className="personal-info">
              <h2>Personal Info</h2>
              
              <div className="info-item">
                <span className="info-label">Known For</span>
                <span className="info-value">{profile.known_for_department}</span>
              </div>

              <div className="info-item">
                <span className="info-label">Known Credits</span>
                <span className="info-value">{credits.movies.length + credits.tvShows.length}</span>
              </div>

              <div className="info-item">
                <span className="info-label">Gender</span>
                <span className="info-value">{profile.gender === 1 ? 'Female' : 'Male'}</span>
              </div>

              <div className="info-item">
                <span className="info-label">Birthday</span>
                <span className="info-value">
                  {profile.birthday && `${profile.birthday} (${calculateAge(profile.birthday)} years old)`}
                </span>
              </div>

              <div className="info-item">
                <span className="info-label">Place of Birth</span>
                <span className="info-value">{profile.place_of_birth}</span>
              </div>

              {profile.also_known_as?.length > 0 && (
                <div className="info-item">
                  <span className="info-label">Also Known As</span>
                  <div className="info-value">
                    {profile.also_known_as.map(name => (
                      <div key={name}>{name}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Col>

          <Col md={9}>
            <div className="biography-section mb-4">
              <h2>Biography</h2>
              <div className="biography-text">
                {profile.biography || 'No biography available.'}
              </div>
            </div>
            
            <Tab.Container defaultActiveKey="movies">
              <Nav variant="tabs" className="mb-3">
                <Nav.Item>
                  <Nav.Link eventKey="movies">Movies ({credits.movies.length})</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="tv">TV Shows ({credits.tvShows.length})</Nav.Link>
                </Nav.Item>
              </Nav>
              <Tab.Content>
                <Tab.Pane eventKey="movies">
                  {credits.movies.length > 0 
                    ? renderMediaPosters(credits.movies, 'movie')
                    : <p>No movie credits found.</p>}
                </Tab.Pane>
                <Tab.Pane eventKey="tv">
                  {credits.tvShows.length > 0 
                    ? renderMediaPosters(credits.tvShows, 'tv')
                    : <p>No TV show credits found.</p>}
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CastProfileModal;