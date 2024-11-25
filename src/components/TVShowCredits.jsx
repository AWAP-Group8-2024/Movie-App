import React, { useEffect, useState } from 'react';
import './TVShowCredits.css';
import CastProfileModal from './CastProfileModal';

function TVShowCredits({ showId }) {
  const [topCast, setTopCast] = useState([]);
  const [topCrew, setTopCrew] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const placeholderImage = 'https://via.placeholder.com/80?text=No+Photo';

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/tv/${showId}/credits?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
        );
        const data = await response.json();

        if (data.cast && data.crew) {
          // Filter and sort cast members
          const sortedCast = data.cast
            .filter((cast) => cast.name && cast.character)
            .sort((a, b) => b.popularity - a.popularity)
            .slice(0, 5);
          setTopCast(sortedCast);

          // Filter and sort crew members
          const sortedCrew = data.crew
            .filter(
              (member) =>
                member.name &&
                member.job &&
                ['Director', 'Producer', 'Writer'].includes(member.job)
            )
            .sort((a, b) => b.popularity - a.popularity)
            .slice(0, 5);
          setTopCrew(sortedCrew);
        }
      } catch (error) {
        console.error('Error fetching TV show credits:', error);
      }
    };

    if (showId) {
      fetchCredits();
    }
  }, [showId]);

  const getProfileImageUrl = (path) =>
    path ? `https://image.tmdb.org/t/p/w200${path}` : placeholderImage;

  const handlePersonClick = (person) => {
    setSelectedPerson(person.id);
    setShowModal(true);
  };

  if (!topCast.length && !topCrew.length) {
    return null;
  }

  return (
    <div className="credits-container">
      {topCast.length > 0 && (
        <>
          <h3 className="credits-title">Top Cast</h3>
          <div className="credits-row">
            {topCast.map((castMember) => (
              <div 
                key={castMember.id} 
                className="credits-item"
                onClick={() => handlePersonClick(castMember)}
                role="button"
                tabIndex={0}
              >
                <img
                  src={getProfileImageUrl(castMember.profile_path)}
                  alt={castMember.name}
                  className="profile-photo"
                />
                <div className="profile-details">
                  <strong>{castMember.name}</strong>
                  <span className="role">as {castMember.character}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {topCrew.length > 0 && (
        <>
          <h3 className="credits-title">Key Crew</h3>
          <div className="credits-row">
            {topCrew.map((crewMember) => (
              <div 
                key={crewMember.id} 
                className="credits-item"
                onClick={() => handlePersonClick(crewMember)}
                role="button"
                tabIndex={0}
              >
                <img
                  src={getProfileImageUrl(crewMember.profile_path)}
                  alt={crewMember.name}
                  className="profile-photo"
                />
                <div className="profile-details">
                  <strong>{crewMember.name}</strong>
                  <span className="role">{crewMember.job}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <CastProfileModal 
        personId={selectedPerson}
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setSelectedPerson(null);
        }}
      />
    </div>
  );
}

export default TVShowCredits;