import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getGroupByGroupId } from '../../services/GroupServices';

const GroupDetail = () => {
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);

  useEffect(() => {
    const fetchGroupDetail = async () => {
      const response = await getGroupByGroupId(groupId);
      setGroup(response.data);
    };
    fetchGroupDetail();
  }, [groupId]);

  return (
    <div>
      {group ? (
        <>
          <h3>{group.name}</h3>
          <p>Creator ID: {group.creator_id}</p>
        </>
      ) : (
        <p>Loading group details...</p>
      )}
    </div>
  );
};

export default GroupDetail;
