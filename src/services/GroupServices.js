// src/services/groupService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export const getAllGroups = async () => {
  const response = await axios.get(`${API_URL}/groups`, { withCredentials: true });
  return response.data;
};

export const getGroupsByUserId = async (userId) => {
  const response = await axios.get(`${API_URL}/groups/${userId}`, { withCredentials: true });
  return response.data;
};

export const createNewGroup = async (groupData) => {
  const response = await axios.post(`${API_URL}/groups/create`, groupData, { withCredentials: true });
  return response.data;
};

export const getGroupByGroupId = async (userId, groupId) => {
  const response = await axios.get(`${API_URL}/groups/${userId}/${groupId}`, { withCredentials: true });
  return response.data;
};

export const updateGroupById = async (userId, groupId, updatedData) => {
  const response = await axios.put(`${API_URL}/groups/${userId}/${groupId}`, updatedData, { withCredentials: true });
  return response.data;
};

export const deleteGroupById = async (userId, groupId) => {
  const response = await axios.delete(`${API_URL}/groups/${userId}/${groupId}`, { withCredentials: true });
  return response.data;
};
