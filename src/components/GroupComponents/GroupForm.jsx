import React, { useState, useEffect } from 'react';
import { createNewGroup } from '../../services/GroupServices';
import { useNavigate } from 'react-router-dom';

const GroupForm = () => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is authenticated
    const token = JSON.parse(sessionStorage.getItem("user"))?.token;
    if (!token) {
      navigate('/login'); // Redirect to login page if not authenticated
    }
  }, [navigate]);

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
    } catch (error) {
      setError('Error creating group');
    }
  };

  return (
    <div>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Group name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit">Create Group</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default GroupForm;
