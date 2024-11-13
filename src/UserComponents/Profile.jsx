import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useUser } from "./useUser.jsx";
import Navigation from "../components/Navigation.jsx";
import {
  Card,
  Container,
  Form,
  Button,
  Modal,
  Row,
  Col,
} from "react-bootstrap";

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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (profileId) {
      getUserProfile(profileId)
        .then((userProfile) => {
          console.log(userProfile);
          setProfileData(userProfile);
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
      await removeAccount(email, password);
      alert("Account deleted successfully.");
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to delete account.";
      alert(message);
    }
  };

  //   console.log("profileId", profileId);
  //   console.log("loggedInUserId", loggedInUserId);

  return (
    <Container>
      <Navigation />
      <Row className="mt-4">
        {/* Profile Card on the left */}
        <Col md={3} className="d-flex justify-content-center">
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
              {/* Edit button only for own profile */}
              {isOwnProfile && <Button variant="outline-dark">Edit</Button>}
            </Card.Body>
          </Card>
        </Col>

        {/* Main content area in the center */}
        <Col md={8}>
          <div className="main-content mb-4">
            {/* Additional content could go here */}
          </div>
          {/* Logout and Delete Account Buttons */}
          {isOwnProfile && (
            <div className="d-flex flex-column align-items-start mt-3">
              <Button
                variant="outline-dark"
                onClick={handleLogout}
                className="mb-2"
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
        </Col>
      </Row>

      {/* Modal for Account Deletion */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Account Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Control
                type="password"
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            onClick={handleDelete}
            disabled={!email || !password}
          >
            Delete
          </Button>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
