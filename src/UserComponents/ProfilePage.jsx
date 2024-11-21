import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useUser } from "./UseUser";
import { useFavorite } from "./FavoriteProvider";
import Navigation from "../components/Navigation.jsx";
import { Container } from "react-bootstrap";
import AccountDeleteModal from "./ProfileComponents/AccountDeleteModal.jsx";
import CreateGroupModal from "./ProfileComponents/CreateGroupModal";
import ProfileBody from "./ProfileComponents/ProfileBody.jsx";

export default function ProfilePage() {
  const {
    user,
    removeAccount,
    getUserProfile,
    updateUserProfile,
    getUserGroups,
    handleLogout,
    createNewGroup,
  } = useUser();
  const {
    favorites,
    getUserFavorites,
    addFavorite,
    removeFavorite,
    getFavoritesByType,
  } = useFavorite();

  const navigate = useNavigate();
  const { profileId } = useParams();
  const currentUrl = window.location.href;
  const loggedInUserId = user?.id?.toString();
  const isOwnProfile = profileId === loggedInUserId;

  const [profileData, setProfileData] = useState(null);
  const [groupData, setGroupData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [userConfirm, setUserConfirm] = useState({ email: "", password: "" });
  const [newGroup, setNewGroup] = useState({ name: "", description: "" });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);

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

      getUserFavorites()
        .then(() => console.log("Favorites fetched successfully"))
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

  const handleGroupSubmit = async () => {
    if (!newGroup.name.trim()) {
      alert("Group name is required.");
      return;
    }
    try {
      await createNewGroup(newGroup);
      setShowCreateGroupModal(false);
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
        handleDelete={handleDelete}
        userConfirm={userConfirm}
        setUserConfirm={setUserConfirm}
        setIsEditing={setIsEditing}
        groupData={groupData}
        handleGroupClick={handleGroupClick}
        handleShare={handleShare}
        setShowCreateGroupModal={setShowCreateGroupModal}
      />
      <AccountDeleteModal
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        handleDelete={handleDelete}
        userConfirm={userConfirm}
        setUserConfirm={setUserConfirm}
      />
      <CreateGroupModal
        showCreateGroupModal={showCreateGroupModal}
        setShowCreateGroupModal={setShowCreateGroupModal}
        newGroup={newGroup}
        setNewGroup={setNewGroup}
        handleGroupSubmit={handleGroupSubmit}
      />
    </Container>
  );
}
