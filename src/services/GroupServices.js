// src/services/groupService.js
import axios from "axios";
import { getUserFromSession } from "../components/utils.js";

const API_URL = process.env.REACT_APP_BACKEND_URL;

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
  return token
    ? {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    : null;
};

// Fetches all groups
export const getAllGroups = async () => {
  const headers = getAuthHeaders();
  if (!headers) return;

  try {
    const response = await axios.get(`${API_URL}/api/group`, { headers });
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
    const response = await axios.get(`${API_URL}/api/group/all`, { headers });
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
    const response = await axios.get(
      `${API_URL}/api/group/${groupId}/members`,
      {
        headers,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching group members by group ID:", error);
    throw error;
  }
};

// Creates a new group
export const createNewGroup = async (groupData) => {
  const headers = getAuthHeaders();
  if (!headers) return;

  try {
    const response = await axios.post(
      `${API_URL}/api/group/create`,
      groupData,
      {
        headers,
      }
    );
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
    const response = await axios.get(`${API_URL}/api/group/${groupId}`, {
      headers,
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching group ${groupId}:`, error);
    throw error;
  }
};

// Updates a group by its ID
export const updateGroupByGroupId = async (groupId, groupData) => {
  const headers = getAuthHeaders();
  if (!headers) return;

  try {
    const response = await axios.put(
      `${API_URL}/api/group/${groupId}`,
      groupData,
      {
        headers,
      }
    );
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
    const response = await axios.delete(
      `${API_URL}/api/group/delete/${groupId}`,
      {
        headers,
      }
    );
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
    const userReqests = await getUserJoinRequests();
    let alreadyExists = false;

    userReqests.forEach((element) => {
      if (element.group_id === groupId && element.status === "pending") {
        alreadyExists = true;
      }
    });

    if (alreadyExists) {
      alert(
        `Request has already been sent and is pending.  You can see all your requests in user profile`
      );
      return;
    } else {
      alert(`Request sent! You can see all your requests in user profile`);
      const response = await axios.post(
        `${API_URL}/api/group/${groupId}/join`,
        {},
        { headers }
      );
      return response.data;
    }
  } catch (error) {
    console.error(`Error sending join request to group ${groupId}:`, error);
    throw error;
  }
};

export const cancelJoinRequest = async (groupId) => {
  console.log("groupId", groupId);
  try {
    const user = getUserFromSession();
    const token = user.token;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    const response = await axios.delete(
      `${API_URL}/api/group/${groupId}/cancel`,
      {
        headers,
      }
    );
    console.log("Join request canceled successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error canceling join request:", error.message);
    throw error;
  }
};

// Fetches pending join requests for a group
export const viewPendingRequests = async (groupId) => {
  const headers = getAuthHeaders();
  if (!headers) return;

  try {
    const response = await axios.get(
      `${API_URL}/api/group/${groupId}/requests`,
      {
        headers,
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching pending requests for group ${groupId}:`,
      error
    );
    throw error;
  }
};

// Updates a join request status
export const updateJoinRequestStatus = async (groupId, requestId, status) => {
  const headers = getAuthHeaders();
  if (!headers) return;

  try {
    const response = await axios.put(
      `${API_URL}/api/group/${groupId}/requests/${requestId}`,
      { status },
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error updating join request status for group ${groupId}:`,
      error
    );
    throw error;
  }
};

// leave a group by its ID
export const leaveGroupByGroupId = async (groupId) => {
  const headers = getAuthHeaders();
  if (!headers) return;

  try {
    const response = await axios.delete(
      `${API_URL}/api/group/${groupId}/leave`,
      {
        headers,
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error leaving group ${groupId}:`, error);
    throw error;
  }
};

// Removes a member from the group by its ID
export const removeMemberFromGroup = async (groupId, memberId) => {
  const headers = getAuthHeaders();
  if (!headers) return;

  try {
    const response = await axios.delete(
      `${API_URL}/api/group/${groupId}/remove/${memberId}`,
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error removing member ${memberId} from group ${groupId}:`,
      error
    );
    throw error;
  }
};

export const getUserJoinRequests = async () => {
  const headers = getAuthHeaders();
  if (!headers) return;
  try {
    const response = await axios.get(
      `${API_URL}/api/user/groupPendingRequests`,
      {
        headers,
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error getting join requests:`, error);
    throw error;
  }
};

export const cancelUserJoinRequests = async () => {
  const headers = getAuthHeaders();
  if (!headers) return;
  try {
    const response = await axios.delete(`${API_URL}/api/user/PendingRequests`, {
      headers,
    });
    return response.data;
  } catch (error) {
    console.error(`Error getting join requests:`, error);
    throw error;
  }
};

export const getGroupPosts = async (groupId) => {
  const headers = getAuthHeaders();
  if (!headers) return;
  try {
    const response = await axios.get(`${API_URL}/api/group/${groupId}/posts`, {
      headers,
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching posts for group ${groupId}:`, error);
    throw error;
  }
};

export const createGroupPost = async (groupId, postDescription, movieId, mediaType) => {
  const headers = getAuthHeaders();
  const accountId = getUserFromSession().id;
  if (!headers) return;

  try {
    const payload = {
      accountId,
      description: postDescription,
      ...(movieId && { contentId: movieId }),
      ...(mediaType && { contentType: mediaType })
    };

    const response = await axios.post(`${API_URL}/api/group/${groupId}/posts`, payload, {
      headers,
    });
    return response.data;
  } catch (error) {
    console.error(`Error creating post for group ${groupId}:`, error);
    throw error;
  }
};
export const updateGroupPost = async (groupId, postId, postDescription, movieId, mediaType) => {
  const headers = getAuthHeaders();
  if (!headers) return;

  try {
    const payload = {
      description: postDescription,
      ...(movieId && { contentId: movieId }),
      ...(mediaType && { contentType: mediaType })
    };

    const response = await axios.put(
      `${API_URL}/api/group/edit/${groupId}/posts/${postId}`,
      payload,
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating post for group ${groupId}:`, error);
    throw error;
  }
};

export const deleteGroupPost = async (groupId, postId) => {
  const headers = getAuthHeaders();
  if (!headers) return;
  try {
    const response = await axios.delete(
      `${API_URL}/api/group/delete/${groupId}/posts/${postId}`,
      {
        groupId,
        postId,
        headers,
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error deleting post for group ${groupId}:`, error);
    throw error;
  }
};

// COMMENT SERVICES

// Fetches comments for a post
export const getCommentsByPostId = async (groupId, postId) => {
  const headers = getAuthHeaders();
  if (!headers) return;
  try {
    const response = await axios.get(
      `${API_URL}/api/group/${groupId}/posts/${postId}/comments`,
      {
        headers,
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching comments for post ${postId}:`, error);
    throw error;
  }
};

// Creates a comment for a post
export const createComment = async (groupId, postId, commentText) => {
  const headers = getAuthHeaders();
  if (!headers) return;
  try {
    const response = await axios.post(
      `${API_URL}/api/group/${groupId}/posts/${postId}/comments`,
      {
        content: commentText,
      },
      {
        headers,
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error creating comment for post ${postId}:`, error);
    throw error;
  }
};

// Updates a comment by its ID
export const updateComment = async (
  groupId,
  postId,
  commentId,
  commentText
) => {
  const headers = getAuthHeaders();
  if (!headers) return;
  try {
    const response = await axios.put(
      `${API_URL}/api/group/${groupId}/posts/${postId}/comments/${commentId}`,
      { content: commentText, headers }
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating comment ${commentId}:`, error);
    throw error;
  }
};

// Deletes a comment by its ID
export const deleteComment = async (groupId, postId, commentId) => {
  const headers = getAuthHeaders();
  if (!headers) return;
  try {
    const response = await axios.delete(
      `${API_URL}/api/group/${groupId}/posts/${postId}/comments/${commentId}`,
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error(`Error deleting comment ${commentId}:`, error);
    throw error;
  }
};

export function formatePostContentId(contentId) {
  if (contentId[0] === 'm') {
      return {
          media_type: 'movie',
          id: contentId.replace('m', '')
      }
  } else {
      return {
          media_type: 'tv',
          id: contentId.replace('t', '')
      }
  }
}