import { Form, Row, Col } from "react-bootstrap";
export default function PrivateInfo({
  profileData,
  isEditing,
  handleInputChange,
}) {
  return (
    <>
      <Row className="my-2">
        <Col className="ms-1">
          <Form.Group>
            <Form.Label>Firstname:</Form.Label>
            <Form.Control
              type="text"
              name="firstname"
              value={profileData.firstname ?? ""}
              onChange={handleInputChange}
              readOnly={!isEditing}
              size="sm"
              style={{ width: "150px" }}
            />
          </Form.Group>
        </Col>
        <Col className="ms-1">
          <Form.Group>
            <Form.Label>Lastname:</Form.Label>
            <Form.Control
              type="text"
              name="lastname"
              value={profileData.lastname ?? ""}
              onChange={handleInputChange}
              readOnly={!isEditing}
              size="sm"
              style={{ width: "150px" }}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row className="my-2">
        <Col className="ms-1">
          <Form.Group>
            <Form.Label>Phone:</Form.Label>
            <Form.Control
              type="text"
              name="phone"
              value={profileData.phone ?? ""}
              onChange={handleInputChange}
              readOnly={!isEditing}
              size="sm"
              style={{ width: "150px" }}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row className="my-2">
        <Col className="ms-1">
          <Form.Group>
            <Form.Label>Address:</Form.Label>
            <Form.Control
              type="text"
              name="address"
              value={profileData.address ?? ""}
              onChange={handleInputChange}
              readOnly={!isEditing}
              size="sm"
            />
          </Form.Group>
        </Col>
      </Row>
      <Row className="my-2">
        <Col className="ms-1">
          <Form.Group>
            <Form.Label>Password:</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={profileData.password ?? ""}
              onChange={handleInputChange}
              readOnly={!isEditing}
              size="sm"
            />
          </Form.Group>
        </Col>
      </Row>
    </>
  );
}
