import React from 'react';
import GroupList from './GroupList';
import GroupForm from './GroupForm';
import Navigation from '../Navigation';

const GroupPage = () => {
  return (
    <div>
      <Navigation />
      <h1>Group Management</h1>
      <GroupForm />
      <GroupList fetchType="all" />
    </div>
  );
};

export default GroupPage;
