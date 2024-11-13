import React, { useEffect, useState } from 'react';
import { getAllGroups } from '../../services/GroupServices';

const GroupList = () => {
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const data = await getAllGroups();
        setGroups(data);
      } catch (error) {
        setError('Error fetching groups');
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
            {group.name} - Created by {group.creator_id}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GroupList;
