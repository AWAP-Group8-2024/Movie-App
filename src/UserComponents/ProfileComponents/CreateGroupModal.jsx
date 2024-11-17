import { Form, Button, Modal } from "react-bootstrap";

export default function CreateGroupModal({
  showCreateGroupModal,
  setShowCreateGroupModal,
  newGroup,
  setNewGroup,
  handleGroupSubmit,
}) {
  const handleInputChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setNewGroup((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  return (
    <Modal
      show={showCreateGroupModal}
      onHide={() => setShowCreateGroupModal(false)}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Create a New Group</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formGroupTitle">
            <Form.Label>Group Title</Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Enter group title"
              value={newGroup.name}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="formGroupDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              placeholder="Enter group description"
              value={newGroup.description}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleGroupSubmit}>
          Submit
        </Button>
        <Button
          variant="secondary"
          onClick={() => setShowCreateGroupModal(false)}
        >
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
