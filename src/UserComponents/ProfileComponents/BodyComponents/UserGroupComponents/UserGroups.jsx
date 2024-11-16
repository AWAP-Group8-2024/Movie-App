import { Card, Row } from "react-bootstrap";
import {
  UserGroupIcon,
  UserGroupInfo,
  UserGroupViewButton,
} from "./UserGroupComponents";
export default function UserGroups({ groupData, handleGroupClick }) {
  return (
    <>
      {groupData.length > 0 ? (
        groupData.map((group, i) => (
          <Card key={i} className="mb-3">
            <Card.Body>
              <Row>
                <UserGroupIcon />
                <UserGroupInfo group={group} />
                <UserGroupViewButton
                  group={group}
                  handleGroupClick={handleGroupClick}
                />
              </Row>
            </Card.Body>
          </Card>
        ))
      ) : (
        <Card.Text>No groups joined yet.</Card.Text>
      )}
    </>
  );
}
