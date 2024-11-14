import { Button, Row, Col } from "react-bootstrap";

export default function ProfileAction({
  handleLogout,
  setShowModal,
  setIsEditing,
  isEditing,
  handleSave,
  handleCancel,
}) {
  return (
    <Row className="mt-3 ps-3">
      {!isEditing ? (
        <>
          <Col xs="auto">
            <Button variant="outline-dark" onClick={handleLogout}>
              Log out
            </Button>
          </Col>
          <Col xs="auto">
            <Button variant="outline-danger" onClick={() => setShowModal(true)}>
              Delete Account
            </Button>
          </Col>
          <Col xs="auto">
            <Button variant="outline-dark" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          </Col>
        </>
      ) : (
        <>
          <Col xs="auto">
            <Button variant="success" onClick={handleSave}>
              Save
            </Button>
          </Col>
          <Col xs="auto">
            <Button variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
          </Col>
        </>
      )}
    </Row>
  );
}
