import React from 'react'
import  {createNewGroup} from '../../services/GroupServices'

const GroupForm = ({ onGroupCreate }) => {
    const [newGroupName, setNewGroupName] = useState("");
    const handleCreateGroup = async (e) => {
        e.preventDefault();
        if (!newGroupName) return;
        try {
        const newGroup = await createNewGroup({ name: newGroupName });
        onGroupCreate(newGroup);
        setNewGroupName("");
        } catch (error) {
        console.error(error);
        }
    };
  return (
      <div>
          <form onSubmit={handleCreateGroup}>
              <label>
                  Group Name:
              </label>
                <input
                    type="text"
                    value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
              />
              <button type="submit">Create Group</button>
              
          </form>
    </div>
  )
}

export default GroupForm