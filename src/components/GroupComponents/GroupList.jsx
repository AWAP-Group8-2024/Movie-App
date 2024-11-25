import React, { useEffect, useState } from "react";
import {
  createNewGroup,
  getAllGroups,
  getGroupsByUserId,
  sendJoinRequest,
  updateGroupByGroupId,
} from "../../services/GroupServices";
import { useNavigate } from "react-router-dom";
import Navigation from "../Navigation";
import EditGroupForm from "./EditGroupForm";

const GroupList = ({ fetchType }) => {
  const [groups, setGroups] = useState([]);
  const [name, setName] = useState("");
  const [userId, setUserId] = useState(0);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [userGroups, setUserGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const [editingGroup, setEditingGroup] = useState(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const user = JSON.parse(sessionStorage.getItem("user"));
        if (!user?.id) {
          if (!sessionStorage.getItem("alertShown")) {
            alert("You have to login to view Groups.");
            sessionStorage.setItem("alertShown", "true");
          }
          navigate("/login");
          return;
        }
        setUserId(user.id);

        const groupsData = await getAllGroups();
        setGroups(groupsData);
        const userGroupData = await getGroupsByUserId(user.id);
        setUserGroups(userGroupData);

        const availableGroups = groupsData.filter(
          (group) =>
            !userGroupData.some((userGroup) => userGroup.id === group.id) &&
            group.creator_id !== user.id
        );

        setFilteredGroups(availableGroups);
        setMessage("");
      } catch (err) {
        setError("Failed to fetch groups");
        console.error("Error fetching groups:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [navigate]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);

    const results = groups.filter((group) =>
      group.name.toLowerCase().includes(e.target.value.toLowerCase())
    );

    const filteredResults = results.filter(
      (group) =>
        !userGroups.some((userGroup) => userGroup.id === group.id) &&
        group.creator_id !== userId
    );

    setFilteredGroups(filteredResults);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Group name is required");
      return;
    }
    try {
      const newGroup = await createNewGroup({
        name: name,
        description: description,
      });
      setMessage(`Group "${newGroup.name}" created successfully!`);
      alert(`Group "${newGroup.name}" created successfully!`);
      setName("");
      setDescription("");
      navigate(`/groups/${newGroup.id}`);
    } catch (error) {
      setError("Error creating group");
    }
  };

  const handleSaveEdit = async (updatedGroup) => {
    try {
      await updateGroupByGroupId(updatedGroup.id, updatedGroup);
      setGroups((prevGroups) =>
        prevGroups.map((group) =>
          group.id === updatedGroup.id ? updatedGroup : group
        )
      );
      setEditingGroup(null);
      setMessage("Group updated successfully.");
    } catch (err) {
      setError("Failed to update group. Please try again.");
    }
  };

  const handleCancelEdit = () => {
    setEditingGroup(null);
  };

  const handleJoinGroup = async (groupId) => {
    try {
      await sendJoinRequest(groupId);
      navigate("/groups/all");
      setMessage("Join request sent successfully.");
    } catch (err) {
      setError(err.message || "An error occurred while sending join request.");
    }
  };

  if (loading)
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );

  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div>
      <Navigation />
      <div className="container mt-5">
        {message && <div className="alert alert-success">{message}</div>}
        {editingGroup ? (
          <EditGroupForm
            group={editingGroup}
            onSave={handleSaveEdit}
            onCancel={handleCancelEdit}
          />
        ) : fetchType === "user" ? (
          <>
            <h2 className="text-center mb-4">Create a New Group</h2>
            <form onSubmit={handleSubmit} className="p-4 bg-light rounded">
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter group name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <textarea
                  className="form-control"
                  placeholder="Enter group description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">
                Create Group
              </button>
            </form>
            <h2 className="text-center mt-5 mb-4">Your Groups</h2>
            <div className="row">
              {userGroups.length === 0 ? (
                <p className="text-center">You haven't joined any groups yet.</p>
              ) : (
                userGroups.map((group) => (
                  <div key={group.id} className="col-lg-4 col-md-6 col-sm-12 mb-3">
                    <div className="card h-100 shadow-sm">
                      <div className="card-body">
                        <h5 className="card-title">{group.name}</h5>
                        <p className="card-text text-muted">
                          Created by {group.creator_id}
                        </p>
                        <div className="d-flex justify-content-between">
                          <a href={`/groups/${group.id}`} className="btn btn-dark btn-sm">
                            View Group
                          </a>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => setEditingGroup(group)}
                          >
                            Edit Group
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          <>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2>Search Groups</h2>
              <div style={{ maxWidth: "400px" }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by group name"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
            </div>

            <div className="row">
              {filteredGroups.length === 0 ? (
                <p className="text-center">No available groups found.</p>
              ) : (
                filteredGroups.map((group) => (
                  <div key={group.id} className="col-lg-4 col-md-6 col-sm-12 mb-3">
                    <div className="card h-100 shadow-sm">
                      <div className="card-body">
                        <h5 className="card-title">{group.name}</h5>
                        <p className="card-text text-muted">
                          Created by {group.creator_id}
                        </p>
                        <div className="d-flex justify-content-between mt-3">
                          
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleJoinGroup(group.id)}
                          >
                            Join Group
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GroupList;