import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useUser } from "./useUser.jsx";
import Navigation from "../components/Navigation.jsx";
import { Container, Form, Button, Modal } from "react-bootstrap";

export default function Profile() {
  const { RemoveAccount } = useUser();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };
  const handleDelete = async () => {
    try {
      await RemoveAccount(email, password); // Passes email, password for verification
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
      <Form align="center">
        <Button
          variant="outline-dark"
          onClick={handleLogout}
          className="ms-0 ms-lg-2 mt-2 mt-lg-0"
        >
          Log out
        </Button>
        <Button
          variant="outline-danger"
          onClick={() => setShowModal(true)}
          className="ms-0 ms-lg-2 mt-2 mt-lg-0"
        >
          Delete Account
        </Button>

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
              <Form.Group>
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
      </Form>
    </Container>
  );
}
