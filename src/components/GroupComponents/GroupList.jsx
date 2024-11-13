import React, { useEffect, useState } from "react";
import { getAllGroups, createNewGroup } from "../../services/GroupServices";


const GroupList = () => {
    const [groups, setGroups] = useState([]);
    
    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const groups = await getAllGroups();
                setGroups(groups);
            } catch (error) {
                console.error(error);
            }
        }
        fetchGroups();
    }, []);
    

    
    return (
        <div>
        <h1>Groups</h1>
        <ul>
            {groups.map((group) => (
            <li key={group.id}>{group.name}</li>
            ))}
        </ul>
         </div>
    );
}
    
export default GroupList;