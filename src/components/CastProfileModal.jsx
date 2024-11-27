// CastProfileModal.jsx

import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import './CastProfile.css';

const CastProfileModal = ({ personId, show, onHide }) => {
  const [profile, setProfile] = useState(null);
  const [credits, setCredits] = useState({ movies: [], tvShows: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (personId) {
      // Fetch person details and credits
      Promise.all([
        fetch(`https://api.themoviedb.org/3/person/${personId}?api_key=${process.env.REACT_APP_TMDB_API_KEY}`),
        fetch(`https://api.themoviedb.org/3/person/${personId}/combined_credits?api_key=${process.env.REACT_APP_TMDB_API_KEY}`)
      ])
        .then(([profileRes, creditsRes]) => Promise.all([profileRes.json(), creditsRes.json()]))
        .then(([profileData, creditsData]) => {
          setProfile(profileData);
          
          // Filter and sort credits
          const sortedCredits = {
            movies: creditsData.cast
              .filter(credit => credit.media_type === 'movie' && credit.poster_path)
              .sort((a, b) => new Date(b.release_date || '0') - new Date(a.release_date || '0')),
            tvShows: creditsData.cast
              .filter(credit => credit.media_type === 'tv' && credit.poster_path)
              .sort((a, b) => new Date(b.first_air_date || '0') - new Date(a.first_air_date || '0'))
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

  if (loading) {
    return (
      <Modal show={show} onHide={onHide} size="lg" centered>
        <Modal.Body className="text-center py-5">Loading...</Modal.Body>
      </Modal>
    );
  }

  if (!profile) return null;

  return (
    <Modal show={show} onHide={onHide} size="lg" centered className="cast-profile-modal">
      <Modal.Header closeButton>
        <Modal.Title>{profile.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="profile-container">
          <img
            src={`https://image.tmdb.org/t/p/w300${profile.profile_path}`}
            alt={profile.name}
            className="profile-image"
          />
          <div className="profile-info">
            <h4>{profile.name}</h4>
            <p className="biography">{profile.biography || 'No biography available.'}</p>
            <div className="personal-details">
              <p><strong>Known For:</strong> {profile.known_for_department}</p>
              <p><strong>Birthday:</strong> {profile.birthday || 'N/A'}</p>
              <p><strong>Place of Birth:</strong> {profile.place_of_birth || 'N/A'}</p>
            </div>
          </div>
        </div>
        <div className="works-section">
          <h5>Notable Works</h5>
          <div className="works-grid">
            {credits.movies.slice(0, 6).map(movie => (
              <div key={movie.id} className="work-item">
                <img
                  src={`https://image.tmdb.org/t/p/w185${movie.poster_path}`}
                  alt={movie.title}
                  className="work-poster"
                />
                <div className="work-info">
                  <p className="work-title">{movie.title}</p>
                  <p className="work-character">{movie.character}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CastProfileModal;