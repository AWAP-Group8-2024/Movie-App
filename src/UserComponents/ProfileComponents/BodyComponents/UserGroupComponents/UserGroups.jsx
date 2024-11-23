import { Card, Row, Col } from "react-bootstrap";

import {
  UserGroupIcon,
  UserGroupInfo,
  UserGroupViewButton,
  UserGroupDeleteButton,
} from "./UserGroupComponents";
import styles from "./UserGroups.module.css";
import { useGroup } from "../../../GroupProvider";

export default function UserGroups({
  handleGroupViewButton,
  handleGroupDeleteButton,
}) {
  const { groups, setGroups, getUserGroups, createNewGroup } = useGroup();
  return (
    <>
      {groups.length > 0 ? (
        <div className={styles.groupListContainer}>
          {groups.map((group, i) => (
            <Card key={i} className="mb-3">
              <Card.Body>
                <Row className="d-flex align-items-center">
                  <UserGroupIcon />
                  <UserGroupInfo group={group} />
                  <Col
                    xs={5}
                    className="d-flex flex-column align-items-center p-0"
                  >
                    <UserGroupViewButton
                      group={group}
                      handleGroupViewButton={handleGroupViewButton}
                    />
                    <UserGroupDeleteButton
                      group={group}
                      handleGroupDeleteButton={handleGroupDeleteButton}
                    />
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}
        </div>
      ) : (
        <Card.Text>No groups joined yet.</Card.Text>
      )}
    </>
  );
}
