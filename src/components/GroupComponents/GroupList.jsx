import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllGroups } from '../../services/GroupServices';

const GroupList = () => {
  
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        
        const data = await getAllGroups();
        setGroups(data);
      } catch (error) {
        if (error.message === 'User not authenticated') {
          navigate('/login'); // Redirect to the login page
        } else {
          setError('Error fetching groups');
        }
      }
    };

    fetchGroups();
  }, []);

  return (
    <div>
      <h2>All Groups</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {groups.map((group) => (
          <li key={group.id}>
            <Link to={`/groups/${group.id}`}>
              {group.name} - Created by {group.creator_id}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GroupList;
