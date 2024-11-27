import React, { useEffect, useState } from "react";
import "./TVShowCredits.css";
import CastProfileModal from "./CastProfileModal";

function TVShowCredits({ showId }) {
  const [cast, setCast] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/tv/${showId}/credits?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US`
        );
        const data = await response.json();
        setCast(data.cast || []);
      } catch (error) {
        console.error("Error fetching TV show credits:", error);
      }
    };

    if (showId) {
      fetchCredits();
    }
  }, [showId]);

  const handlePersonClick = (person) => {
    setSelectedPerson(person.id);
    setShowModal(true);
  };

  if (!cast.length) {
    return null;
  }

  return (
    <div className="credits-container">
      <h3 className="credits-title">Top Billed Cast</h3>
      <div className="cast-list">
        {cast.slice(0, 10).map((castMember) => (
          <div
            key={castMember.id}
            className="cast-card"
            onClick={() => handlePersonClick(castMember)}
            role="button"
            tabIndex={0}
          >
            <div className="cast-image-container">
              {castMember.profile_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w185${castMember.profile_path}`}
                  alt={castMember.name}
                  className="cast-image"
                />
              ) : (
                <div className="no-photo">No Photo</div>
              )}
            </div>
            <div className="cast-info">
              <div className="cast-name">{castMember.name}</div>
              <div className="cast-character">{castMember.character}</div>
            </div>
          </div>
        ))}
      </div>

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