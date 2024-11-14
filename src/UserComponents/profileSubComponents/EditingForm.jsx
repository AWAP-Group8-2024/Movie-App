import { Form, Button, Row, Col } from "react-bootstrap";

export default function EditingForm({
  editData,
  handleInputChange,
  handleSave,
  handleCancel,
}) {
  return (
    <>
      <Row className="my-2">
        <Col xs className="ms-1">
          <Form.Group className="d-flex align-items-center">
            <Form.Label className="mb-0 me-2">Firstname:</Form.Label>
            <Form.Control
              type="text"
              name="firstname"
              value={editData.firstname}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Col>
        <Col xs className="ms-1">
          <Form.Group className="d-flex align-items-center">
            <Form.Label className="mb-0 me-2">Lastname:</Form.Label>
            <Form.Control
              type="text"
              name="lastname"
              value={editData.lastname}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="my-2">
        <Col xs className="ms-1">
          <Form.Group className="d-flex align-items-center">
            <Form.Label className="mb-0 me-2">Phone:</Form.Label>
            <Form.Control
              type="text"
              name="phone"
              value={editData.phone || ""}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="my-2">
        <Col xs className="ms-1">
          <Form.Group className="d-flex align-items-center">
            <Form.Label className="mb-0 me-2">Address:</Form.Label>
            <Form.Control
              type="text"
              name="address"
              value={editData.address || ""}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="my-2">
        <Col xs className="ms-1">
          <Form.Group className="d-flex align-items-center">
            <Form.Label className="mb-0 me-2">Password:</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={editData.password || ""}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md="auto" className="me-2">
          <Button variant="success" onClick={handleSave}>
            Save
          </Button>
        </Col>
        <Col md="auto">
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
        </Col>
      </Row>
    </>
  );
}
