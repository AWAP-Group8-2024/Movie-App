import { createContext, useState, useContext } from "react";
import axios from "axios";
import { useUser } from "./useUser";
import { getUserFromSession } from "../components/utils.js";

const url = process.env.REACT_APP_API_URL;

const GroupContext = createContext();

export default function GroupProvider({ children }) {
  const [groups, setGroups] = useState([]);

  const { user } = useUser();
  const token = user.token;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const getUserGroups = async () => {
    try {
      const response = await axios.get(`${url}/group/all`, { headers });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch groups:", error);
      throw error;
    }
  };

  const createNewGroup = async (newGroup) => {
    try {
      const response = await axios.post(`${url}/group/create`, newGroup, {
        headers,
      });
      window.location.reload();
      return response.data;
    } catch (error) {
      console.error("Failed to create a new group:", error);
      throw error;
    }
  };

  const leaveGroup = async (groupId) => {
    try {
      const response = await axios.delete(`${url}/group/${groupId}/leave`, {
        headers,
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to leave the group ${groupId}:`, error);
      throw error;
    }
  };

  return (
    <GroupContext.Provider
      value={{
        groups,
        setGroups,
        getUserGroups,
        createNewGroup,
        leaveGroup,
      }}
    >
      {children}
    </GroupContext.Provider>
  );
}

export const useGroup = () => useContext(GroupContext);
