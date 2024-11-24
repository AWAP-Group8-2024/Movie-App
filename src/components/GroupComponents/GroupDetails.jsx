import React, { useEffect, useState } from "react";
import {
  getGroupByGroupId,
  getGroupMembersbyGroupId,
  deleteGroupByGroupId,
  sendJoinRequest,
  leaveGroupByGroupId,
} from "../../services/GroupServices";
import { useParams, useNavigate } from "react-router-dom";
import Navigation from "../Navigation";
import { useUser } from "../../UserComponents/useUser.js";
import JoinRequestList from "./JoinRequestList";
import "bootstrap/dist/css/bootstrap.min.css";

const GroupDetails = () => {
  const navigate = useNavigate();
  const { groupId } = useParams();
  const { user, isLoading: userLoading } = useUser();
  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [showJoinRequest, setShowJoinRequest] = useState(false);

  useEffect(() => {
    if (groupId) {
      const fetchGroupDetails = async () => {
        try {
          setLoading(true);
          setError(null);

          const groupData = await getGroupByGroupId(groupId);
          const groupMembers = await getGroupMembersbyGroupId(groupId);

          setGroup(groupData);
          setMembers(groupMembers);

          if (user) {
            const isGroupMember = groupMembers.some(
              (member) => member.id === user.id
            );
            setIsMember(isGroupMember);

            if (user.id === groupData.creator_id) {
              setIsOwner(true);
            }
          }
        } catch (err) {
          if (err.message === "User not authenticated") {
            navigate("/login");
          }
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      if (!userLoading) {
        fetchGroupDetails();
      }
    } else {
      setError("Invalid group ID.");
    }
  }, [groupId, user, userLoading, navigate]);

  const handleDeleteGroup = async () => {
    try {
      await deleteGroupByGroupId(groupId);
      setMessage("Group deleted successfully.");
      navigate("/groups/user");
    } catch (err) {
      if (err.message === "User not authenticated") {
        navigate("/login");
      } else if (
        err.message === "Only the group owner can proceed this operation"
      ) {
        setError("You are not the creator of this group.");
      } else {
        console.error(err);
      }
    }
  };

  const handleJoinGroup = async () => {
    try {
      const existingRequest = members.some(
        (member) => member.id === user.id && member.status === "Pending"
      );

      if (existingRequest) {
        setError("You have already sent a join request to this group.");
        return;
      }

      await sendJoinRequest(groupId);
      setMessage("Join request sent successfully.");
      navigate("/groups/all");
    } catch (err) {
      if (err.message === "User not authenticated") {
        navigate("/login");
      } else {
        setError(err.message || "Failed to join group.");
        console.error(err);
      }
    }
  };
  const handleLeaveGroup = async () => {
    try {
      // if the user is the owner of the group, they cannot leave the group
      if (isOwner) {
        setError(
          "You are the owner of this group. You cannot leave the group."
        );
        return;
      }
      await leaveGroupByGroupId(groupId);
      setMessage("You have left the group successfully.");
      navigate("/groups/all");
      console.log("You have left the group successfully.");
    } catch (err) {
      if (err.message === "User not authenticated") {
        navigate("/login");
      } else {
        setError(err.message || "Failed to leave group.");
        console.error(err);
      }
    }
  };

  if (loading || userLoading)
    return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="alert alert-danger mt-5">{error}</div>;
  if (message) return <div className="alert alert-success mt-5">{message}</div>;

  return (
    <div>
      <Navigation />
      <div className="container mt-5">
        <h2 className="mb-4">Group Details</h2>
        {group ? (
          <div className="card shadow-sm">
            <div className="card-body">
              <h3 className="card-title">{group.name}</h3>
              <p className="card-text">
                <strong>Group ID:</strong> {group.id}
              </p>
              <p className="card-text">
                <strong>Description:</strong> {group.description}
              </p>
              <p className="card-text">
                <strong>Creator:</strong> {group.creator_id}
              </p>

              <div className="d-flex flex-wrap gap-2 mt-3">
                {/* Display the 'Leave Group' button only if the user is a member and not the owner */}
                {isMember && !isOwner ? (
                  <button className="btn btn-danger" onClick={handleLeaveGroup}>
                    Leave Group
                  </button>
                ) : !isOwner ? (
                  <button className="btn btn-primary" onClick={handleJoinGroup}>
                    Join Group
                  </button>
                ) : null}

                {/* Display buttons for the owner to manage the group */}
                {isOwner && (
                  <>
                    <button
                      className={`btn ${
                        showJoinRequest ? "btn-secondary" : "btn-info"
                      } me-2`}
                      onClick={() => setShowJoinRequest(!showJoinRequest)}
                    >
                      {showJoinRequest
                        ? "Hide Pending Requests"
                        : "Show Pending Requests"}
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={handleDeleteGroup}
                    >
                      Delete Group
                    </button>
                  </>
                )}
              </div>

              {showJoinRequest && isOwner && (
                <div className="mt-4">
                  <h4>Pending Join Requests</h4>
                  <div className="table-responsive mt-3">
                    <table className="table table-striped table-hover">
                      <JoinRequestList groupId={groupId} />
                    </table>
                  </div>
                </div>
              )}

              <h4 className="mt-4">Group Members</h4>
              {members.length > 0 ? (
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Email</th>
                      <th>First Name</th>
                      <th>Last Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((member) => (
                      <tr key={member.id}>
                        <td>{member.id}</td>
                        <td>{member.email}</td>
                        <td>{member.firstname}</td>
                        <td>{member.lastname}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No members found.</p>
              )}
            </div>
          </div>
        ) : (
          <div className="alert alert-warning">No group details found.</div>
        )}
      </div>
    </div>
  );
};

export default GroupDetails;
