import { Card, Col, CardText, CardHeader } from "react-bootstrap";
import { CreateGroupButton } from "./GroupCardComponents/CreateGroupButton";
import UserGroups from "./GroupCardComponents/UserGroups";
import ViewJoinRequests from "./GroupCardComponents/ViewJoinRequests";

export const GroupCard = ({ setCreateGroupModalIsOpen, isOwnProfile }) => {
  return (
    <>
      <Col md={3} className="d-flex justify-content-center mb-2">
        <Card style={{ width: "100%" }}>
          <CardHeader className="rounded">
            <CardText className="d-flex justify-content-center align-items-center">
              User Group List
            </CardText>
          </CardHeader>
          <Card.Body>
            {isOwnProfile && <ViewJoinRequests />}
            <UserGroups />
            <div className="d-flex justify-content-center align-items-center mt-3">
              {isOwnProfile && (
                <CreateGroupButton
                  setCreateGroupModalIsOpen={setCreateGroupModalIsOpen}
                />
              )}
            </div>
          </Card.Body>
        </Card>
      </Col>
    </>
  );
};
