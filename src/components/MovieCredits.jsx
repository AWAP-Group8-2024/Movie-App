import React, { useEffect, useState } from 'react';

function MovieCredits({ movieId }) {
  const [topCast, setTopCast] = useState([]);
  const [topCrew, setTopCrew] = useState([]);

  useEffect(() => {
    const fetchCredits = async () => {
      const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${process.env.REACT_APP_API_KEY}`);
      const data = await response.json();

      // Sort cast by popularity and take top 3-4
      const sortedCast = data.cast.sort((a, b) => b.popularity - a.popularity);
      setTopCast(sortedCast.slice(0, 4));

      // Sort crew by popularity and filter for main departments, take top 3-4
      const sortedCrew = data.crew
        .filter(member => ["Director", "Producer", "Screenplay", "Writer"].includes(member.job))
        .sort((a, b) => b.popularity - a.popularity);
      setTopCrew(sortedCrew.slice(0, 4));
    };

    fetchCredits();
  }, [movieId]);

  return (
    <div>
      <p><strong>Top Cast Members</strong></p>
      <ul>
        {topCast.map(castMember => (
          <li key={castMember.id}>{castMember.name} as {castMember.character}</li>
        ))}
      </ul>

      <p><strong>Key Crew Members</strong></p>
      <ul>
        {topCrew.map(crewMember => (
          <li key={crewMember.id}>{crewMember.name} - {crewMember.job}</li>
        ))}
      </ul>
    </div>
  );
}

export default MovieCredits;
