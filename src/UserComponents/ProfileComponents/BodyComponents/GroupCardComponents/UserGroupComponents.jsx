import { IoPeopleOutline, IoEyeSharp, IoTrashBin } from "react-icons/io5";
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
    <Col xs={4} className="p-0">
      <Card.Title className="d-flex align-items-center justify-content-center">
        {group.name}
      </Card.Title>
      {group.description && (
        <Card.Text className="text-muted">{group.description}</Card.Text>
      )}
      <small className="text-muted d-flex align-items-center justify-content-center">
        {group.member_count} members
      </small>
    </Col>
  );
};

export const UserGroupViewButton = ({ group, handleGroupViewButton }) => {
  return (
    <Button
      variant="outline-primary"
      size="sm"
      onClick={() => handleGroupViewButton(group.id)}
      className="mb-2 ms-5"
    >
      <IoEyeSharp />
    </Button>
  );
};

export const UserGroupDeleteButton = ({ group, handleGroupDeleteButton }) => {
  return (
    <Button
      variant="outline-danger"
      size="sm"
      onClick={() => handleGroupDeleteButton(group.id)}
      className="ms-5"
    >
      <IoTrashBin />
    </Button>
  );
};
