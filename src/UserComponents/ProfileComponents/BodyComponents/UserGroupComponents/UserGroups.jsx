import { Card, Row, Col } from "react-bootstrap";
import {
  UserGroupIcon,
  UserGroupInfo,
  UserGroupViewButton,
  UserGroupDeleteButton,
} from "./UserGroupComponents";
import styles from "./UserGroups.module.css"; // Import CSS module styles

export default function UserGroups({ groupData, handleGroupClick }) {
  return (
    <>
      {groupData.length > 0 ? (
        <div className={styles.groupListContainer}>
          {groupData.map((group, i) => (
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
                      handleGroupClick={handleGroupClick}
                    />
                    <UserGroupDeleteButton
                      group={group}
                      handleGroupClick={handleGroupClick}
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
