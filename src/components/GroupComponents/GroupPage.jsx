import React, { useState, useEffect } from 'react';
import { createNewGroup, getAllGroups, getGroupsByUserId, sendJoinRequest } from '../../services/GroupServices';
import { useNavigate } from 'react-router-dom';
import Navigation from '../Navigation';

const GroupPage = ({ fetchType }) => {
  const [name, setName] = useState('');
  const [groups, setGroups] = useState([]);
  const [userGroups, setUserGroups] = useState([]); // To store the groups the user has joined
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is authenticated
    const token = JSON.parse(sessionStorage.getItem('user'))?.token;
    if (!token) {
      navigate('/login'); // Redirect to login page if not authenticated
    }

    // Function to fetch groups based on fetchType
    const fetchGroups = async () => {
      try {
        setLoading(true);
        setError(null);
        let data;

        if (fetchType === 'all') {
          // Fetch all groups
          data = await getAllGroups();
          
          // Fetch the groups the user has joined (for comparison)
          const userId = 1; // Replace with actual user ID
          const userGroupData = await getGroupsByUserId(userId);
          setUserGroups(userGroupData); // Store the user's joined groups

          // Filter out groups the user has already joined
          data = data.filter(group => 
            !userGroupData.some(userGroup => userGroup.id === group.id)
          );
        } else if (fetchType === 'user') {
          // Fetch groups the user has joined
          const userId = 1; // Replace with actual user ID
          data = await getGroupsByUserId(userId);
        }

        setGroups(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [fetchType]);

  const handleSearch = (searchTerm) => {
    // Filter groups based on the search term
    const filteredGroups = groups.filter(group =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Filter out groups the user has already joined
    const userId = 1; // Replace with actual user ID
    const filteredResults = filteredGroups.filter(group =>
      !userGroups.some(userGroup => userGroup.id === group.id) &&
      group.creator_id !== userId
    );

    setGroups(filteredResults);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Group name is required');
      return;
    }
    try {
      const newGroup = await createNewGroup({ name });
      setMessage(`Group ${newGroup.name} created!`);
      setName('');
      // Optionally, you can navigate or update group list after creating
    } catch (error) {
      setError('Error creating group');
    }
  };

  const handleJoinGroup = async (groupId) => {
    try {
      await sendJoinRequest(groupId); // Pass groupId directly here
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

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!groups.length) return <div className="alert alert-warning">No groups found.</div>;

  return (
    <div>
      <Navigation />

      {/* Group Creation Form */}
      <div className="container mt-5">
        <h2>Create a New Group</h2>
        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Enter group name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary">Create Group</button>
        </form>
      </div>

      {/* Group Search */}
      <div className="container mt-5">
        <h2>{fetchType === 'all' ? 'Available Groups' : 'Your Groups'}</h2>
        <input
          type="text"
          className="form-control mb-4"
          placeholder="Search groups"
          onChange={(e) => handleSearch(e.target.value)}
        />

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
      </div>
    </div>
  );
};

export default GroupPage;
