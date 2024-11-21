// src/services/groupService.js
import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;

// Retrieves the token and alerts if the user is not authenticated
const getAuthToken = () => {
  const token = JSON.parse(sessionStorage.getItem("user"))?.token;
  if (!token) {
    throw new Error("User not authenticated");
  }
  return token;
};

// Sets common headers for authorized requests
const getAuthHeaders = () => {
  const token = getAuthToken();
  return token ? {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  } : null;
};

// Fetches all groups
export const getAllGroups = async () => {
  const headers = getAuthHeaders();
  if (!headers) return;

  try {
    const response = await axios.get(`${API_URL}/group`, { headers });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching all groups:", error);
    throw error;
  }
};

// Fetches groups by user ID
export const getGroupsByUserId = async (id) => {
  const headers = getAuthHeaders();
  if (!headers) return;

  const userId = parseInt(id, 10);

  if (isNaN(userId)) {
    console.error("Invalid user ID");
    return;
  }

  try {
    const response = await axios.get(`${API_URL}/group/all`, {headers});
    return response.data;
  } catch (error) {
    console.error("Error fetching groups by user ID:", error);
    throw error;
  }
};

export const getGroupMembersbyGroupId = async (groupId) => {
  const headers = getAuthHeaders();
  if (!headers) return;
  try {
    const response = await axios.get(`${API_URL}/group/${groupId}/members`, { headers });
    return response.data;
  } catch (error) {
    console.error("Error fetching group members by group ID:", error);
    throw error;
  }
}

// Creates a new group
export const createNewGroup = async (groupData) => {
  const headers = getAuthHeaders();
  if (!headers) return;

  try {
    const response = await axios.post(`${API_URL}/group/create`, groupData, {
      headers,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating new group:", error);
    throw error;
  }
};

// Fetches a group by its ID
export const getGroupByGroupId = async (groupId) => {
  const headers = getAuthHeaders();
  if (!headers) return;

  try {
    const response = await axios.get(`${API_URL}/group/${groupId}`, { headers });
    return response.data;
  } catch (error) {
    console.error(`Error fetching group ${groupId}:`, error);
    throw error;
  }
};

// Updates a group by its ID
export const updateGroupByGroupId = async (groupId, updatedData) => {
  const headers = getAuthHeaders();
  if (!headers) return;

  try {
    const response = await axios.put(`${API_URL}/group/${groupId}`, updatedData, { headers });
    return response.data;
  } catch (error) {
    console.error(`Error updating group ${groupId}:`, error);
    throw error;
  }
};

// Deletes a group by its ID
export const deleteGroupByGroupId = async (groupId) => {
  const headers = getAuthHeaders();
  if (!headers) return;

  try {
    const response = await axios.delete(`${API_URL}/group/delete/${groupId}`, { headers });
    return response.data;
  } catch (error) {
    console.error(`Error deleting group ${groupId}:`, error);
    throw error;
  }
};

// Sends a join request to a group
export const sendJoinRequest = async (groupId) => {
  const headers = getAuthHeaders();
  if (!headers) return;

  try {
    const response = await axios.post(`${API_URL}/group/${groupId}/join`, {}, { headers });
    return response.data;
  } catch (error) {
    console.error(`Error sending join request to group ${groupId}:`, error);
    throw error;
  }
};

// Fetches pending join requests for a group
export const viewPendingRequests = async (groupId) => {
  const headers = getAuthHeaders();
  if (!headers) return;

  try {
    const response = await axios.get(`${API_URL}/group/${groupId}/requests`, { headers });
    return response.data;
  } catch (error) {
    console.error(`Error fetching pending requests for group ${groupId}:`, error);
    throw error;
  }
};

// Updates a join request status
export const updateJoinRequestStatus = async (groupId, requestId, status) => {
  const headers = getAuthHeaders();
  if (!headers) return;

  try {
    const response = await axios.put(
      `${API_URL}/group/${groupId}/requests/${requestId}`,
      { status },
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating join request status for group ${groupId}:`, error);
    throw error;
  }
};