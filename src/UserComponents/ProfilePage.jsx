import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useUser } from "./useUser.jsx";
import Navigation from "../components/Navigation.jsx";
import { Container } from "react-bootstrap";
import AccountDeleteModal from "./profileSubComponents/AccountDeleteModal.jsx";
import ProfileBody from "./profileSubComponents/ProfileBody.jsx";

export default function Profile() {
  const { user, removeAccount, getUserProfile } = useUser();
  const navigate = useNavigate();

  const currentUrl = window.location.href;
  const profileId = currentUrl.match(/\/profile\/(\d+)/)?.[1];
  const loggedInUserId = user?.id?.toString();
  const isOwnProfile = profileId === loggedInUserId;

  const [profileData, setProfileData] = useState(null);
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
          alert("Unable to fetch profile details.");
        });
    }
  }, [getUserProfile, profileId]);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

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

  const handleSave = () => {
    setProfileData(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(profileData);
    setIsEditing(false);
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
