import { Card, Row, Col } from "react-bootstrap";
import {
  UserGroupIcon,
  UserGroupInfo,
  UserGroupViewButton,
  UserGroupDeleteButton,
} from "./UserGroupComponents";
import styles from "./UserGroups.module.css";
import { useUser } from "../../../UserProvider";
import { useGroup } from "../../../GroupProvider";
import { useNavigate } from "react-router-dom";

export default function UserGroups() {
  const navigate = useNavigate();
  const { groups, leaveGroup } = useGroup();
  const { user } = useUser();

  const handleGroupViewButton = (groupId) => {
    navigate(`/groups/${groupId}`);
  };

  const handleGroupDeleteButton = async (groupId) => {
    try {
      await leaveGroup(groupId);
      alert("Leave group successfully!");
      window.location.reload();
    } catch (error) {
      alert("Failed to leave a group");
    }
  };

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
                    {user.id != group.creator_id ? (
                      <UserGroupDeleteButton
                        group={group}
                        handleGroupDeleteButton={() => {
                          handleGroupDeleteButton(group.id);
                        }}
                      />
                    ) : null}
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}
        </div>
      ) : (
        <Card.Text className="d-flex flex-column align-items-center mt-2">
          No groups joined yet.
        </Card.Text>
      )}
    </>
  );
}
