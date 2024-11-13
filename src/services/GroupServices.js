// src/services/groupService.js
import axios from 'axios';
const API_URL = "http://localhost:5000/group";

// A function that returns the authorization token from the UserContext
const getAuthToken = () => JSON.parse(sessionStorage.getItem("user"))?.token;

export const getAllGroups = async () => {
  try {
    const token = getAuthToken();
    const response = await axios.get(`${API_URL}/`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching all groups:", error);
    throw error;
  }
};

export const getGroupsByUserId = async () => {
  try {
    const token = getAuthToken();
    const response = await axios.get(`${API_URL}/group/all`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching groups by user ID:", error);
    throw error;
  }
};

export const createNewGroup = async (groupData) => {
  try {
    const token = getAuthToken();
    const response = await axios.post(`${API_URL}/create`, groupData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating new group:", error);
    throw error;
  }
};

export const getGroupByGroupId = async (groupId) => {
  try {
    const token = getAuthToken();
    const response = await axios.get(`${API_URL}/group/${groupId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching group ${groupId}:`, error);
    throw error;
  }
};

export const updateGroupByGroupId = async (groupId, updatedData) => {
  try {
    const token = getAuthToken();
    const response = await axios.put(`${API_URL}/group/${groupId}`, updatedData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating group ${groupId}:`, error);
    throw error;
  }
};

export const deleteGroupByGroupId = async (groupId) => {
  try {
    const token = getAuthToken();
    const response = await axios.delete(`${API_URL}/group/delete/${groupId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error deleting group ${groupId}:`, error);
    throw error;
  }
};
