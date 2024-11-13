import React from 'react';
import GroupList from './GroupList';
import GroupForm from './GroupForm';

const GroupPage = () => {
  return (
    <div>
      <h1>Group Management</h1>
      <GroupForm />
      <GroupList />
    </div>
  );
};

export default GroupPage;
