import { Card, Col, CardText, CardHeader } from "react-bootstrap";
import { CreateGroupButton } from "./UserInfoComponents/Button";
import UserGroups from "./UserGroupComponents/UserGroups";

export const GroupCard = ({
  groupData,
  handleGroupClick,
  setShowCreateGroupModal,
}) => {
  return (
    <>
      <Col md={3} className="d-flex justify-content-center mb-2">
        <Card style={{ width: "100%" }}>
          <Card.Body>
            <CardHeader className="border-0 mb-1 rounded">
              <CardText className="d-flex justify-content-center align-items-center">
                Group List
              </CardText>
            </CardHeader>
            <UserGroups
              groupData={groupData}
              handleGroupClick={handleGroupClick}
            />
            <div className="d-flex justify-content-center align-items-center mt-3">
              <CreateGroupButton
                setShowCreateGroupModal={setShowCreateGroupModal}
              />
            </div>
          </Card.Body>
        </Card>
      </Col>
    </>
  );
};
