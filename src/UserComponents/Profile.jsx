import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useUser } from "./useUser.jsx";
import Navigation from "../components/Navigation.jsx";
import { Card, Container, Button, Row, Col, CardFooter } from "react-bootstrap";
import AccountDeleteModal from "./AccountDeleteModal.jsx";

export default function Profile() {
  const { user, removeAccount, getUserProfile } = useUser();
  const navigate = useNavigate();

  // Extract profileId from the URL
  const currentUrl = window.location.href;
  const profileId = currentUrl.match(/\/profile\/(\d+)/)?.[1];

  const loggedInUserId = user?.id?.toString();
  const isOwnProfile = profileId === loggedInUserId;

  // State to store profile data
  const [profileData, setProfileData] = useState(null);

  // State for handling modal visibility, email, and password inputs
  const [userConfirm, setUserConfirm] = useState({
    email: "",
    password: "",
  });
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (profileId) {
      getUserProfile(profileId)
        .then((userProfile) => {
          console.log(userProfile);
          setProfileData({ ...userProfile, password: "" });
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

  return (
    <Container>
      <Navigation />
      <Row className="mt-4">
        {/* Profile Card on the left */}
        <Col md={4} className="d-flex justify-content-center">
          <Card style={{ width: "100%" }}>
            <Card.Body>
              {/* Conditional Rendering to avoid null reference error */}
              {profileData ? (
                <>
                  <Card.Text>ID: {profileData.id}</Card.Text>
                  <Card.Text>Email: {profileData.email}</Card.Text>
                  <Card.Text>Firstname: {profileData.firstname}</Card.Text>
                  <Card.Text>Lastname: {profileData.lastname}</Card.Text>
                  {isOwnProfile && (
                    <>
                      <Card.Text>Phone: {profileData.phone}</Card.Text>
                      <Card.Text>Address: {profileData.address}</Card.Text>
                      <Card.Text>Password: {profileData.password}</Card.Text>
                    </>
                  )}
                </>
              ) : (
                <Card.Text>Loading profile...</Card.Text>
              )}
              {/* Share and Edit buttons */}
              <Button
                variant="outline-primary"
                className="me-2"
                onClick={() => {
                  try {
                    navigator.clipboard.writeText(currentUrl);
                    alert("URL copied to clipboard!");
                  } catch (error) {
                    alert("Failed to copy URL.");
                  }
                }}
              >
                Share
              </Button>
            </Card.Body>
            <CardFooter>
              {isOwnProfile && (
                <div className="d-flex align-item-center">
                  <Button variant="outline-dark" className="mr-2">
                    Edit
                  </Button>

                  <Button
                    variant="outline-dark"
                    onClick={handleLogout}
                    className="ml-2"
                  >
                    Log out
                  </Button>
                  <Button
                    variant="outline-danger"
                    onClick={() => setShowModal(true)}
                  >
                    Delete Account
                  </Button>
                </div>
              )}
            </CardFooter>
          </Card>
        </Col>

        {/* Main content area in the center */}
        <Col md={8}>
          <div className="main-content mb-4">
            {/* Additional content could go here */}
          </div>
        </Col>
      </Row>

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
