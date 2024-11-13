import React, { useEffect, useState } from "react";

import GroupForm from "./GroupForm";
import GroupList from "./GroupList";

const GroupPage = () => {
    const [groups, setGroups] = useState([]);

    const handleGroupCreated = (newGroup) => {
        setGroups([...groups, newGroup]);
    };
};

return (
    <div>
        <GroupForm onGroupCreate={handleGroupCreated} />
        <GroupList groups={groups} />
    </div>
);

export default GroupPage;