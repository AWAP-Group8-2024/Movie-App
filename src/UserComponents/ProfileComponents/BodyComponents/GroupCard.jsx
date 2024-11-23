import { Card, Col, CardText, CardHeader } from "react-bootstrap";
import { CreateGroupButton } from "./GroupCardComponents/CreateGroupButton";
import UserGroups from "./GroupCardComponents/UserGroups";
import ViewJoinRequests from "./GroupCardComponents/ViewJoinRequests";
import { useGroup } from "../../GroupProvider";
import { useNavigate } from "react-router-dom";

export const GroupCard = ({ setCreateGroupModalIsOpen }) => {
  return (
    <>
      <Col md={3} className="d-flex justify-content-center mb-2">
        <Card style={{ width: "100%" }}>
          <CardHeader className="rounded">
            <CardText className="d-flex justify-content-center align-items-center">
              My Group List
            </CardText>
          </CardHeader>
          <Card.Body>
            <ViewJoinRequests />
            <UserGroups />
            <div className="d-flex justify-content-center align-items-center mt-3">
              <CreateGroupButton
                setCreateGroupModalIsOpen={setCreateGroupModalIsOpen}
              />
            </div>
          </Card.Body>
        </Card>
      </Col>
    </>
  );
};
