import { Form, Button, Modal } from "react-bootstrap";

export default function AccountDeleteModal({
  showModal,
  setShowModal,
  handleDelete,
  userConfirm,
  setUserConfirm,
}) {
  return (
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
              value={userConfirm.email}
              onChange={(e) =>
                setUserConfirm({ ...userConfirm, email: e.target.value })
              }
              required
            />
          </Form.Group>
          <Form.Group className="mt-3">
            <Form.Control
              type="password"
              placeholder="Enter your password"
              value={userConfirm.password}
              onChange={(e) =>
                setUserConfirm({ ...userConfirm, password: e.target.value })
              }
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
        <Button variant="secondary" onClick={() => setShowModal(false)}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
