import React, { useEffect, useState } from 'react';
import { getGroupByGroupId } from '../../services/GroupServices';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '../Navigation';

const GroupDetails = () => {
  const navigate = useNavigate();
  const {groupId} = useParams();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Group ID:", groupId); // Add this to verify the value
    if (groupId) {
      const fetchGroupDetails = async () => {
        try {
          setLoading(true);
          setError(null);
          const groupData = await getGroupByGroupId(groupId);
          setGroup(groupData);
        } catch (err) {
          if (err.message === 'User not authenticated') {
            // Redirect to the login page
            navigate('/login');
          }
          setError(err.message);
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
  
      fetchGroupDetails();
    } else {
      setError("Invalid group ID.");
    }
  }, [groupId]);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  // If group data is available, display it
  return (
    <div>
      <Navigation />
      <h2>Group Details</h2>
      {group ? (
        <div>
          <h3>{group.name}</h3> 
          <p><strong>Group ID:</strong> {group.id}</p>
          <p><strong>Description:</strong> {group.description}</p> 
          <p><strong>Creator:</strong> {group.creator_id}</p>
          <p>More details to come...</p>

          {/* Add a button to delete the group */}
          <button>Leave Group</button>
          <button>Join Group</button>
          <button>Update Group</button>
          <button>Edit</button>
          <button>Delete Group</button>
          
        </div>
      ) : (
        <div>No group details found.</div>
      )}
    </div>
  );
};

export default GroupDetails;
