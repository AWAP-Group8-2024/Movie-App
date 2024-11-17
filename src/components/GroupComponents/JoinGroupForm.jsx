import React, { useState, useEffect } from 'react';
import { getAllGroups, sendJoinRequest } from '../../services/GroupServices'; // Ensure sendJoinRequest is in your services
import { useNavigate } from 'react-router-dom';
import Navigation from '../Navigation';

const JoinGroupForm = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch available groups
    const fetchGroups = async () => {
      try {
        const data = await getAllGroups();
        setGroups(data);
        setFilteredGroups(data); // Initialize filteredGroups with the fetched data
      } catch (error) {
          if (error.message === 'User not authenticated') {
              navigate('/login'); // Redirect to the login page
          }
          else {
              setError('Error fetching groups');
          }
      }
    };
    fetchGroups();
  }, []);

  const handleSearch = () => {
    // Filter groups based on search term when search button is clicked
    setFilteredGroups(
      groups.filter(group =>
        group.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  const handleSearchInput = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    // Filter groups as user types in the input field
    setFilteredGroups(
      groups.filter(group =>
        group.name.toLowerCase().includes(value.toLowerCase())
      )
    );
  };


  const handleJoinGroup = async () => {
    try {
      await sendJoinRequest(selectedGroupId);
      setMessage('Join request sent successfully.');
      navigate('/groups/all');
    } catch (err) {
      if (err.message === 'User not authenticated') {
        navigate('/login');
      } else if (err.message === 'User already in group') {
        setError('You are already a member of this group.');
      } else if (err.message === 'Join request already sent') {
        setError('You have already sent a join request to this group.');
      }
      else if (error.message === 'User is the creator of the group') {
        setError('You are the creator of this group.');
      }
      else {
        setError('Failed to join group.');
        console.error(err);
      }
    }
  };

  return (
    <div>
      <Navigation />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}

      <form>
        <h2>Select a Group to Join</h2>

        {/* Search Input and Button */}
        <div>
          <input
            type="text"
            placeholder="Search groups"
            value={searchTerm}
            onChange={handleSearchInput}
          />
          <button type="button" onClick={handleSearch}>Search</button>
        </div>

        {/* List of filtered groups */}
        <div>
          {filteredGroups.length > 0 ? (
            <ul>
              {filteredGroups.map((group) => (
                <li
                  key={group.id}
                  onClick={() => setSelectedGroupId(group.id)}
                  style={{
                    cursor: 'pointer',
                    backgroundColor: selectedGroupId === group.id ? '#d3d3d3' : '',
                  }}
                >
                      {group.name}
                      <button
            type="button"
            onClick={() => handleJoinGroup(selectedGroupId)}
            disabled={!selectedGroupId}
          >
            Join Group
          </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No groups found</p>
          )}
        </div>

        {/* Join Group Button */}
        <div>
       
        </div>
      </form>
    </div>
  );
};

export default JoinGroupForm;
