import { Card, Row } from "react-bootstrap";
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
          ))}
        </div>
      ) : (
        <Card.Text>No groups joined yet.</Card.Text>
      )}
    </>
  );
}
