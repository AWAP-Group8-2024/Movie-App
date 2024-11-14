import { Card, Row, Col } from "react-bootstrap";

export default function PrivateInfo({ profileData }) {
  return (
    <>
      <Row className="my-2">
        <Col xs className="ms-1">
          <Card.Text>Firstname: {profileData.firstname}</Card.Text>
        </Col>
        <Col xs className="ms-1">
          <Card.Text>Lastname: {profileData.lastname}</Card.Text>
        </Col>
      </Row>
      <Row className="my-2">
        <Col xs className="ms-1">
          <Card.Text>Phone: {profileData.phone}</Card.Text>
        </Col>
      </Row>
      <Row className="my-2">
        <Col xs className="ms-1">
          <Card.Text>Address: {profileData.address}</Card.Text>
        </Col>
      </Row>
    </>
  );
}
