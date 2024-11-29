import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

import { Container } from "react-bootstrap";

import Navigation from "../components/Navigation.jsx";
import AccountDeleteModal from "./ProfileComponents/AccountDeleteModal.jsx";
import CreateGroupModal from "./ProfileComponents/CreateGroupModal";
import ProfileBody from "./ProfileComponents/ProfileBody.jsx";

import { useUser } from "./UserProvider.jsx";
import { useFavorite } from "./FavoriteProvider";
import { useGroup } from "./GroupProvider";

export default function ProfilePage() {
  const {
    user,
    removeAccount,
    getUserProfile,
    updateUserProfile,
    handleLogout,
  } = useUser();

  const { setFavorites, getUserFavorites } = useFavorite();
  const { setGroups, getUserGroups, createNewGroup } = useGroup();

  const { profileId } = useParams();
  const currentUrl = window.location.href;
  const loggedInUserId = user?.id?.toString();
  const isOwnProfile = profileId === loggedInUserId;

  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [userConfirm, setUserConfirm] = useState({ email: "", password: "" });
  const [newGroup, setNewGroup] = useState({ name: "", description: "" });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [createGroupModalIsOpen, setCreateGroupModalIsOpen] = useState(false);

  useEffect(() => {
    if (profileId) {
      getUserProfile(profileId)
        .then((userProfile) => {
          setProfileData(userProfile);
          setEditData(userProfile);
        })
        .catch((error) => {
          console.error("Failed to fetch profile:", error);
        });

      getUserGroups(profileId)
        .then((userGroups) => {
          setGroups(userGroups);
        })
        .catch((error) => {
          console.error("Failed to fetch groups:", error);
        });

      getUserFavorites(profileId)
        .then((userFavorites) => {
          setFavorites(userFavorites);
        })
        .catch((error) => {
          console.error("Failed to fetch favorties:", error);
        });
    }
  }, [getUserProfile, profileId, getUserFavorites, getUserGroups, setFavorites, setGroups]);

  const handleDelete = async () => {
    try {
      await removeAccount(userConfirm.email, userConfirm.password);
      alert("Account deleted successfully.");
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to delete account.";
      alert(message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (user && editData) {
      try {
        await updateUserProfile(editData);
        alert("Profile updated successfully.");
        setProfileData(editData);
        setIsEditing(false);
      } catch (error) {
        console.error("Failed to update profile:", error);
        alert("Failed to update profile.");
      }
    }
  };

  const handleCancel = () => {
    setEditData(profileData);
    setIsEditing(false);
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      if (navigator.share) {
        await navigator.share({
          title: document.title,
          text: "Check this out!",
          url: currentUrl,
        });
      } else {
        alert("URL copied to clipboard");
      }
    } catch (error) {
      alert("Failed to share the URL");
    }
  };

  const handleGroupSubmit = async () => {
    if (!newGroup.name.trim()) {
      alert("Group name is required.");
      return;
    }
    try {
      await createNewGroup(newGroup);
      setCreateGroupModalIsOpen(false);
      alert("Group created successfully!");
    } catch (error) {
      alert("Failed to create a group");
    }
  };

  return (
    <Container>
      <Navigation />
      <ProfileBody
        profileData={profileData}
        isEditing={isEditing}
        editData={editData}
        handleInputChange={handleInputChange}
        isOwnProfile={isOwnProfile}
        handleSave={handleSave}
        handleCancel={handleCancel}
        handleLogout={handleLogout}
        setShowDeleteModal={setShowDeleteModal}
        setIsEditing={setIsEditing}
        handleShare={handleShare}
        setCreateGroupModalIsOpen={setCreateGroupModalIsOpen}
      />
      <AccountDeleteModal
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        handleDelete={handleDelete}
        userConfirm={userConfirm}
        setUserConfirm={setUserConfirm}
      />
      <CreateGroupModal
        showCreateGroupModal={createGroupModalIsOpen}
        setShowCreateGroupModal={setCreateGroupModalIsOpen}
        newGroup={newGroup}
        setNewGroup={setNewGroup}
        handleGroupSubmit={handleGroupSubmit}
      />
    </Container>
  );
}
