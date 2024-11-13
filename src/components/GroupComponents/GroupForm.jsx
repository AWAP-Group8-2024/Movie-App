import React, { useState } from 'react';
import { createNewGroup } from '../../services/GroupServices';
const GroupForm = () => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Group name is required');
      return;
    }
    try {
      const newGroup = await createNewGroup({ name});
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
