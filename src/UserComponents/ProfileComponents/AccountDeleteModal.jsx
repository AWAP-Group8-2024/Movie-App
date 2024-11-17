import { Form, Button, Modal } from "react-bootstrap";

export default function AccountDeleteModal({
  showDeleteModal,
  setShowDeleteModal,
  handleDelete,
  userConfirm,
  setUserConfirm,
}) {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserConfirm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  return (
    <Modal
      show={showDeleteModal}
      onHide={() => setShowDeleteModal(false)}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Confirm Account Deletion</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Control
              type="email"
              name="email"
              value={userConfirm.email}
              placeholder="Enter your email"
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group className="mt-3">
            <Form.Control
              type="password"
              name="password"
              value={userConfirm.password}
              placeholder="Enter your password"
              onChange={handleInputChange}
              required
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="danger"
          onClick={handleDelete}
          disabled={!userConfirm.email || !userConfirm.password}
        >
          Delete
        </Button>
        <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
