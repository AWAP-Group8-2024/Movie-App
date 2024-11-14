import { Button, Row, Col } from "react-bootstrap";

export default function ProfileAction({
  handleLogout,
  setShowModal,
  setIsEditing,
}) {
  return (
    <>
      <Row className="mt-3">
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
      </Row>
    </>
  );
}
