import { IoPeopleOutline } from "react-icons/io5";
import { Card, Col, Button } from "react-bootstrap";

export const UserGroupIcon = () => {
  return (
    <Col
      xs={3}
      className="d-flex align-items-center justify-content-center p-0"
    >
      <IoPeopleOutline fontSize={20} />
    </Col>
  );
};

export const UserGroupInfo = ({ group }) => {
  return (
    <Col xs={5} className="p-0">
      <Card.Title>{group.name}</Card.Title>
      {group.description && (
        <Card.Text className="text-muted">{group.description}</Card.Text>
      )}
      <small className="text-muted">{group.member_count} members</small>
    </Col>
  );
};

export const UserGroupViewButton = ({ group, handleGroupClick }) => {
  return (
    <Col xs={2} className="d-flex align-items-center p-0">
      <Button
        variant="outline-primary"
        size="sm"
        onClick={() => handleGroupClick(group.id)}
      >
        View Group
      </Button>
    </Col>
  );
};
