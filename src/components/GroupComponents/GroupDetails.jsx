import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getGroupByGroupId, sendJoinRequest, deleteGroupByGroupId } from '../../services/GroupServices';
import Navigation from '../Navigation';

const GroupDetail = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGroupDetail = async () => {
      if (!groupId) {
        setError('Invalid group ID');
        return;
      }
  
      try {
        const response = await getGroupByGroupId(groupId);
        setGroup(response.data);
      } catch (error) {
        if (error.message === 'User not authenticated') {
          navigate('/login'); // Redirect to login page if not authenticated
        } else {
          setError('Error fetching group details');
        }
      }
    };
  
    fetchGroupDetail();
  }, [groupId, navigate]);
  
  const handleJoinGroup = async () => {
    try {
      await sendJoinRequest(groupId);
      alert('You have successfully joined the group!');
    } catch (error) {
      setError('Error joining the group');
    }
  };

  const handleDeleteGroup = async () => {
    try {
      await deleteGroupByGroupId(groupId);
      alert('Group deleted successfully!');
      navigate('/groups');
    } catch (error) {
      setError('Error deleting the group');
    }
  };

  return (
    <div>
      <Navigation />
      {group ? (
        <>
          <h1>Group Details</h1>
          <h3>{group.name}</h3>
          <p>Group ID: {group.id}</p>
          <p>Creator ID: {group.creator_id}</p>
          {/* <p>Description: {group.description}</p> */}

          <p>More details to come</p>
          <button>Edit</button>
          <button onClick={handleDeleteGroup}>Delete</button>
          <button onClick={handleJoinGroup}>Join Group</button>
        </>
      ) : (
        <>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </>
      )}
    </div>
  );
};

export default GroupDetail;
