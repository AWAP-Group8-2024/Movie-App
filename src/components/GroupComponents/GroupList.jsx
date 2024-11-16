import React, { useEffect, useState } from 'react';
import { getAllGroups, getGroupsByUserId } from '../../services/GroupServices';

const GroupList = ({ fetchType }) => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to fetch groups based on fetchType
    const fetchGroups = async () => {
      try {
        setLoading(true);
        setError(null);

        let data;

        // Fetch groups based on fetchType
        if (fetchType === 'all') {
          data = await getAllGroups();
        } else if (fetchType === 'user') {
          // Assuming you have the user ID somehow (replace with actual ID fetching method)
          const userId = 1; // Placeholder for user ID
          data = await getGroupsByUserId(userId);
        }
        
        console.log("Fetched groups:", data)
        setGroups(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [fetchType]); // Re-run when fetchType changes

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>{fetchType === 'all' ? 'All Groups' : 'Your Groups'}</h2>
      <ul>
        {groups.map((group, index) => (
          <li key={index}>
            <a href={`/groups/${group.id}`}>
              {fetchType === 'all' ? `${group.name} - created by ${group.creator_id}` : group.group_name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GroupList;
