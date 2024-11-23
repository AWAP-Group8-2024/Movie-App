import { Card, Col, CardText, CardHeader } from "react-bootstrap";
import { CreateGroupButton } from "./UserInfoComponents/Button";
import UserGroups from "./UserGroupComponents/UserGroups";
import ViewJoinRequests from "./UserGroupComponents/ViewJoinRequests";

export const GroupCard = ({
  // groupData,
  setShowCreateGroupModal,
  handleGroupViewButton,
  handleGroupDeleteButton,
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
            <ViewJoinRequests />
            <UserGroups
              // groupData={groupData}
              handleGroupViewButton={handleGroupViewButton}
              handleGroupDeleteButton={handleGroupDeleteButton}
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
