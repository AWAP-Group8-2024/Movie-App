import React, { useState, useEffect } from "react";
import {
  getAllGroups,
  getGroupsByUserId,
  sendJoinRequest,
} from "../../Services/GroupServices"; // Ensure correct path
import { useNavigate } from "react-router-dom";
import Navigation from "../Navigation";
import "bootstrap/dist/css/bootstrap.min.css";

const JoinGroupForm = () => {
  const [groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [userGroups, setUserGroups] = useState([]); // To store the groups user has joined
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all groups and the user's joined groups when the component mounts
    const fetchGroups = async () => {
      try {
        const groupsData = await getAllGroups();
        setGroups(groupsData);

        const userId = 1; // Replace with actual user ID (from auth context or similar)
        const userGroupData = await getGroupsByUserId(userId);
        setUserGroups(userGroupData); // Store the user's joined groups

        // Filter out groups the user has joined or is the owner of
        const availableGroups = groupsData.filter(
          (group) =>
            !userGroupData.some((userGroup) => userGroup.id === group.id) &&
            group.creator_id !== userId
        );

        setFilteredGroups(availableGroups);
      } catch (err) {
        setError("Failed to fetch groups");
        console.error("Error fetching groups:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  // Handle search and filter
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);

    // Filter groups based on the search term
    const results = groups.filter((group) =>
      group.name.toLowerCase().includes(e.target.value.toLowerCase())
    );

    // Filter out groups the user has joined or is the owner of
    const filteredResults = results.filter(
      (group) =>
        !userGroups.some((userGroup) => userGroup.id === group.id) &&
        group.creator_id !== 1 // Replace with actual user ID
    );

    setFilteredGroups(filteredResults);
  };

  const handleJoinGroup = async (groupId) => {
    try {
      await sendJoinRequest(groupId);
      setMessage("Join request sent successfully.");
      navigate("/groups/all");
    } catch (err) {
      setError("Failed to send join request");
      console.error("Error submitting join request:", err);
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    // Add a container to center the content
    <div>
      <Navigation />
      <div className="container mt-5">
        <h2>Search Groups</h2>
        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="mb-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by group name"
            value={searchTerm}
            onChange={handleSearch} // Directly trigger search on input change
          />
        </div>

        <h3>Available Groups</h3>
        {filteredGroups.length === 0 ? (
          <p>No available groups found.</p>
        ) : (
          <ul className="list-group">
            {filteredGroups.map((group) => (
              <li
                key={group.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <span>
                  {group.name} - created by {group.creator_id}
                </span>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleJoinGroup(group.id)}
                >
                  Join Group
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default JoinGroupForm;
