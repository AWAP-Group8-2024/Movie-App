import React, { useEffect, useState } from "react";
import {
  getGroupByGroupId,
  deleteGroupByGroupId,
  sendJoinRequest,
} from "../../Services/GroupServices";
import { useParams, useNavigate } from "react-router-dom";
import Navigation from "../Navigation";
import { useUser } from "../../UserComponents/UseUser"; // Ensure this is the correct path
import JoinRequestList from "./JoinRequestList";
import "bootstrap/dist/css/bootstrap.min.css";

const GroupDetails = () => {
  const navigate = useNavigate();
  const { groupId } = useParams();
  const { user, isLoading: userLoading } = useUser(); // Get user and loading state from useUser
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const [showJoinRequest, setShowJoinRequest] = useState(false);

  useEffect(() => {
    if (groupId) {
      const fetchGroupDetails = async () => {
        try {
          setLoading(true);
          setError(null);
          const groupData = await getGroupByGroupId(groupId);
          setGroup(groupData);

          // Check if the logged-in user is the creator of the group
          if (user && user.id === groupData.creator_id) {
            setIsOwner(true);
          }
        } catch (err) {
          if (err.message === "User not authenticated") {
            navigate("/login");
          }
          setError(err.message);
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      // Ensure the user is loaded before fetching group details
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
      await sendJoinRequest(groupId);
      setMessage("Join request sent successfully.");
      navigate("/groups/all");
    } catch (err) {
      if (err.message === "User not authenticated") {
        navigate("/login");
      } else if (err.message === "User already in group") {
        setError("You are already a member of this group.");
      } else if (err.message === "Join request already sent") {
        setError("You have already sent a join request to this group.");
      } else if (err.message === "User is the creator of the group") {
        setError("You are the creator of this group.");
      } else {
        setError("Failed to join group.");
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
              <p className="card-text">More details to come...</p>

              {/* Buttons for Join Group and Owner Actions */}
              <div className="d-flex flex-wrap gap-2 mt-3">
                {/* Show Join Group button only for non-owners */}
                {!isOwner && (
                  <button
                    className="btn btn-primary me-2"
                    onClick={handleJoinGroup}
                  >
                    Join Group
                  </button>
                )}

                {/* Show owner buttons */}
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

              {/* Conditional rendering of the Pending Join Requests table */}
              {showJoinRequest && isOwner && (
                <div className="mt-4">
                  <h4>Pending Join Requests</h4>
                  <div className="table-responsive mt-3">
                    <table className="table table-striped table-hover">
                      <tbody>
                        {/* Add rows for each join request */}
                        <JoinRequestList groupId={groupId} />
                      </tbody>
                    </table>
                  </div>
                </div>
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
