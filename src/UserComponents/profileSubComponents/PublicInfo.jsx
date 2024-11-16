import { Card, Row, Col } from "react-bootstrap";

export default function PublicInfo({ profileData }) {
  return (
    <>
      <Row className="my-2">
        <Col xs className="ms-1">
          <Card.Text>ID: {profileData.id}</Card.Text>
        </Col>
        <Col xs className="ms-1">
          <Card.Text>Email: {profileData.email}</Card.Text>
        </Col>
      </Row>
    </>
  );
}
