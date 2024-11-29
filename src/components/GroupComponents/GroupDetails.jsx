import React, { useEffect, useState } from "react";
import {
  getGroupByGroupId,
  getGroupMembersbyGroupId,
  deleteGroupByGroupId,
  sendJoinRequest,
  leaveGroupByGroupId,
  getGroupPosts,
  createGroupPost,
  deleteGroupPost,
  removeMemberFromGroup,
} from "../../services/GroupServices";
import { useParams, useNavigate } from "react-router-dom";
import Navigation from "../Navigation";
import { useUser } from "../../UserComponents/UserProvider";
import JoinRequestList from "./JoinRequestList";
import "bootstrap/dist/css/bootstrap.min.css";

const GroupDetails = () => {
  const navigate = useNavigate();
  const { groupId } = useParams();
  const { user, isLoading: userLoading } = useUser();
  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [posts, setPosts] = useState([]);
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
          const groupPosts = await getGroupPosts(groupId);

          // Sort posts by descending creation date
          groupPosts.sort((a, b) => new Date(b.creation_date) - new Date(a.creation_date));

          setGroup(groupData);
          setMembers(groupMembers);
          setPosts(groupPosts);

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
      if (isOwner) {
        setError(
          "You are the owner of this group. You cannot leave the group."
        );
        return;
      }
      await leaveGroupByGroupId(groupId);
      setMessage("You have left the group successfully.");
      navigate("/groups/all");
    } catch (err) {
      if (err.message === "User not authenticated") {
        navigate("/login");
      } else {
        setError(err.message || "Failed to leave group.");
        console.error(err);
      }
    }
  };

  const handleRemoveMember = async (groupId, memberId) => {
    if (!memberId || isNaN(memberId)) {
      console.error("Invalid member ID:", memberId);
      setError("Invalid member ID.");
      return;
    }

    try {
      await removeMemberFromGroup(groupId, memberId);
      setMessage("Member removed successfully.");
      setMembers(members.filter((member) => member.id !== memberId));
      navigate();
    } catch (err) {
      console.error("Error removing member from group:", err);
      setError(err.message || "Failed to remove member.");
    }
  };

  if (loading || userLoading)
    return <div className="text-center mt-5">Loading...</div>;

  if (error) return <div className="alert alert-danger mt-5">{error}</div>;


  return (
    <div>
      <Navigation />
      {message && <div className="alert alert-success mt-5">{message}</div>}
      <div className="container mt-5">
  <div className="row">
    {/* Left Column: Group Details and Post Form */}
    <div className="col-md-8">
      <h2 className="mb-4">Group Details</h2>
      {group ? (
        <div className="card shadow-sm mb-4">
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
              {isMember && !isOwner ? (
                <button className="btn btn-danger" onClick={handleLeaveGroup}>
                  Leave Group
                </button>
              ) : !isOwner ? (
                <button className="btn btn-primary" onClick={handleJoinGroup}>
                  Join
                </button>
              ) : null}

              {isOwner && (
                <>
                  <button
                    className={`btn ${showJoinRequest ? "btn-secondary" : "btn-info"} me-2`}
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

            <h4 className="mt-4">Create a Post</h4>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const postDescription = e.target.elements.description.value.trim();

                if (!postDescription) {
                  setError("Post description cannot be empty.");
                  return;
                }

                try {
                  const newPost = await createGroupPost(groupId, postDescription);
                  setPosts([newPost, ...posts]);
                  e.target.reset();
                  navigate(0);
                  setMessage("Post created successfully.");
                } catch (err) {
                  setError(err.response?.data?.message || "Failed to create post.");
                }
              }}
            >
              <div className="mb-3">
                <textarea
                  name="description"
                  rows="3"
                  className="form-control"
                  placeholder="Write your post here..."
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary btn-sm">
                Submit
              </button>
            </form>

            <h4 className="mt-4">Group Posts</h4>
            {posts.length > 0 ? (
              <div className="mt-3">
                {posts.map((post) => (
                  <div key={post.post_id} className="card mb-3 shadow-sm">
                    <div className="card-body">
                      <p className="card-text">{post.description}</p>
                      <p className="card-subtitle text-muted">
                        <small>Posted by {post.creator_name} on {new Date(post.creation_date).toLocaleString()}</small>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No posts found in this group.</p>
            )}
          </div>
        </div>
      ) : (
        <p>Group details not available.</p>
      )}
    </div>

    {/* Right Column: Members List */}
    <div className="col-md-4 mt-4"> {/* Added mt-4 here for gap */}
      <h4 className="mb-3">Group Members</h4>
      <div className="card shadow-sm">
        <div className="card-body">
          {members && members.length > 0 ? (
            <div className="list-group">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="list-group-item d-flex justify-content-between align-items-center border-0"
                >
                  <div className="d-flex align-items-center">
                    <div className="ms-3">
                      <h6 className="mb-1">{member.email}</h6>
                      <small className="text-muted">
                        {member.id === group.creator_id ? "Group Creator" : "Member"}
                      </small>
                    </div>
                  </div>

                  <div className="d-flex gap-2">
                    {/* Remove Button */}
                    {isOwner && member.id !== user.id && (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleRemoveMember(groupId, member.id)}
                        title="Remove member"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted">No members found in this group.</p>
          )}
        </div>
      </div>
    </div>
  </div>
</div>

    </div>
  );
};

export default GroupDetails;
