import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useUser } from "./UseUser";
import Navigation from "../components/Navigation.jsx";
import { Container } from "react-bootstrap";
import AccountDeleteModal from "./ProfileComponents/AccountDeleteModal.jsx";
import ProfileBody from "./ProfileComponents/ProfileBody.jsx";

export default function Profile() {
  const {
    user,
    removeAccount,
    getUserProfile,
    updateUserProfile,
    getUserGroups,
    handleLogout,
  } = useUser();
  const navigate = useNavigate();

  const currentUrl = window.location.href;
  const profileId = currentUrl.match(/\/profile\/(\d+)/)?.[1];
  const loggedInUserId = user?.id?.toString();
  const isOwnProfile = profileId === loggedInUserId;

  const [profileData, setProfileData] = useState(null);
  const [groupData, setGroupData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [userConfirm, setUserConfirm] = useState({ email: "", password: "" });
  const [showModal, setShowModal] = useState(false);

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
      getUserGroups()
        .then((userGroups) => {
          setGroupData(userGroups);
        })
        .catch((error) => {
          console.error("Failed to fetch groups:", error);
        });
    }
  }, [getUserProfile, profileId, getUserGroups]);

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

  const handleGroupClick = (groupId) => {
    navigate(`/groups/${groupId}`);
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
        showModal={showModal}
        setShowModal={setShowModal}
        handleDelete={handleDelete}
        userConfirm={userConfirm}
        setUserConfirm={setUserConfirm}
        setIsEditing={setIsEditing}
        groupData={groupData}
        handleGroupClick={handleGroupClick}
        handleShare={handleShare}
      />
      <AccountDeleteModal
        showModal={showModal}
        setShowModal={setShowModal}
        handleDelete={handleDelete}
        userConfirm={userConfirm}
        setUserConfirm={setUserConfirm}
      />
    </Container>
  );
}
