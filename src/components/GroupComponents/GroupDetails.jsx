import React, { useEffect, useState } from 'react';
import { getGroupByGroupId, deleteGroupByGroupId, sendJoinRequest } from '../../services/GroupServices';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '../Navigation';
import { useUser } from "../../UserComponents/useUser"; // Ensure this is the correct path
import JoinRequestList from './JoinRequestList';

const GroupDetails = () => {
  const navigate = useNavigate();
  const { groupId } = useParams();
  const { user, isLoading: userLoading } = useUser(); // Get user and loading state from useUser
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [isOwner, setIsOwner] = useState(false);
  const [showJoinRequest, setShowJoinRequest] = useState(false);

  useEffect(() => {
    console.log("Group ID:", groupId);
    if (groupId) {
      const fetchGroupDetails = async () => {
        try {
          setLoading(true);
          setError(null);
          const groupData = await getGroupByGroupId(groupId);
          setGroup(groupData);

          // Check if the logged-in user is the creator of the group
          if (user && user.id === groupData.creator_id) {
            setIsOwner(true);
          }
        } catch (err) {
          if (err.message === 'User not authenticated') {
            navigate('/login');
          }
          setError(err.message);
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      // Ensure the user is loaded before fetching group details
      if (!userLoading) {
        fetchGroupDetails();
      }
    } else {
      setError("Invalid group ID.");
    }
  }, [groupId, user, userLoading, navigate]);

  const handleDeleteGroup = async () => {
    try {
      await deleteGroupByGroupId(groupId);
      setMessage('Group deleted successfully.');
      navigate('/groups');
    } catch (err) {
      if (err.message === 'User not authenticated') {
        navigate('/login');
      } else if (err.message === 'Only the group owner can proceed this operation') {
        setError('You are not the creator of this group.');
      } else {
        console.error(err);
      }
    }
  };

  const handleJoinGroup = async () => {
    try {
      await sendJoinRequest(groupId);
      setMessage('Join request sent successfully.');
      navigate('/groups/all');
    } catch (err) {
      if (err.message === 'User not authenticated') {
        navigate('/login');
      } else if (err.message === 'User already in group') {
        setError('You are already a member of this group.');
      } else if (err.message === 'Join request already sent') {
        setError('You have already sent a join request to this group.');
      } else if (err.message === 'User is the creator of the group') {
        setError('You are the creator of this group.');
      } else {
        setError('Failed to join group.');
        console.error(err);
      }
    }
  };

  if (loading || userLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (message) return <div>{message}</div>;

  return (
    <div>
      <Navigation />
    {message && <p style={{ color: 'green' }}>{message}</p>}
      <h2>Group Details</h2>
      
      {group ? (
        <div>
        
          <h3>{group.name}</h3>
          <p><strong>Group ID:</strong> {group.id}</p>
          <p><strong>Description:</strong> {group.description}</p>
          <p><strong>Creator:</strong> {group.creator_id}</p>
          <p>More details to come...</p>

          <button onClick={handleJoinGroup}>Join Group</button>
          {isOwner && (
            <>
              <button onClick={() => setShowJoinRequest(!showJoinRequest)}>
                {showJoinRequest ? 'Hide Pending Requests' : 'View Pending Requests'}
              </button>
              {showJoinRequest && <JoinRequestList groupId={groupId} />}
              <button onClick={handleDeleteGroup}>Delete Group</button>
            </>
          )}
        </div>
      ) : (
        <div>No group details found.</div>
      )}
    </div>
  );
};

export default GroupDetails;