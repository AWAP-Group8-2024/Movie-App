import React, { useEffect, useState } from 'react';
import { getAllGroups, getGroupsByUserId, sendJoinRequest } from '../../services/GroupServices';
import { useNavigate } from 'react-router-dom';
import Navigation from '../Navigation';

const GroupList = ({ fetchType }) => {
  const [groups, setGroups] = useState([]);
  const [userGroups, setUserGroups] = useState([]); // To store the groups the user has joined
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Function to fetch groups based on fetchType
    const fetchGroups = async () => {
      try {
        setLoading(true);
        setError(null);

          let data;
        const user = JSON.parse(sessionStorage.getItem('user')); // Get user data from sessionStorage
        const userId = user?.id; // Assuming the user object has the id property

        if (!userId) {
          // If no user ID, redirect to login
          navigate('/login');
          return;
        }

        // Fetch groups based on fetchType
        if (fetchType === 'all') {
          // Fetch all groups
          data = await getAllGroups();
          
          // Fetch the groups the user has joined (for comparison)
          const userGroupData = await getGroupsByUserId(userId);
          setUserGroups(userGroupData); // Store the user's joined groups

          // Filter out groups the user has already joined
          data = data.filter(group => 
            !userGroupData.some(userGroup => userGroup.id === group.id)
          );
        } else if (fetchType === 'user') {
          // Assuming you have the user ID somehow (replace with actual ID fetching method)
          const userId = 1; // Placeholder for user ID
          data = await getGroupsByUserId(userId);
        }

        setGroups(data);
      } catch (err) {
        if (err.message === 'User not authenticated') {
          // Redirect to login if not authenticated
          navigate('/login');
        }
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [fetchType]); // Re-run when fetchType changes

  const handleJoinGroup = async (groupId) => {
    try {
      await sendJoinRequest(groupId); // Pass groupId directly here
      navigate('/groups/all');
      setMessage('Join request sent successfully.');
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

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (message) return <div className="alert alert-success">{message}</div>;

  return (
    <div>
      <Navigation />

      <div className="container mt-5">
        <h2>{fetchType === 'all' ? 'All Groups (Not Joined Yet)' : 'Your Groups'}</h2>
        <div className="row">
          {groups.map((group, index) => (
            <div key={index} className="col-md-4 mb-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{group.name}</h5>
                  {fetchType === 'all' && <p className="card-text">Created by User {group.creator_id}</p>}
                  {fetchType === 'user' && <p className="card-text">Your Group</p>}

                  <a href={`/groups/${group.id}`} className="btn btn-dark mt-2 mx-2">View Group</a>
                  {fetchType === 'all' && (
                    <button
                      className="btn btn-primary mt-2"
                      onClick={() => handleJoinGroup(group.id)}
                    >
                      Join Group
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Display a warning message if no groups are found */}
        {!groups.length && <div className="alert alert-warning">No groups found.</div>}
      </div>
    </div>
  );
};

export default GroupList;
