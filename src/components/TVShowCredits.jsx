import React, { useEffect, useState } from 'react';

function TVShowCredits({ showId }) {
  const [topCast, setTopCast] = useState([]);
  const [topCrew, setTopCrew] = useState([]);

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
            .filter(cast => cast.name && cast.character && cast.profile_path)
            .sort((a, b) => b.popularity - a.popularity)
            .slice(0, 4);
          setTopCast(sortedCast);

          // Filter and sort crew members
          const sortedCrew = data.crew
            .filter(member => 
              member.name && 
              member.job && 
              ["Executive Producer", "Creator", "Producer", "Director", "Writer"].includes(member.job)
            )
            .sort((a, b) => b.popularity - a.popularity)
            .slice(0, 4);
          setTopCrew(sortedCrew);
        }
      } catch (error) {
        console.error('Error fetching credits:', error);
        setTopCast([]);
        setTopCrew([]);
      }
    };

    if (showId) {
      fetchCredits();
    }
  }, [showId]);

  // Don't render anything if no cast and crew data
  if (!topCast.length && !topCrew.length) {
    return null;
  }

  return (
    <div className="credits-container">
      {topCast.length > 0 && (
        <>
          <h3 className="credits-title">Top Cast Members</h3>
          <ul className="credits-list">
            {topCast.map(castMember => (
              <li key={`${castMember.id}-${castMember.character}`} className="credits-item">
                {castMember.name} <span className="role">as {castMember.character}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      {topCrew.length > 0 && (
        <>
          <h3 className="credits-title">Key Crew Members</h3>
          <ul className="credits-list">
            {topCrew.map(crewMember => (
              <li key={`${crewMember.id}-${crewMember.job}`} className="credits-item">
                {crewMember.name} <span className="role">- {crewMember.job}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default TVShowCredits;