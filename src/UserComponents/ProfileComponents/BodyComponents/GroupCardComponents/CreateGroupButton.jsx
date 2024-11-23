import { IoAddCircle } from "react-icons/io5";
import { Col, Button } from "react-bootstrap";
import styles from "../UserInfoCardComponents/Button.module.css";

export const CreateGroupButton = ({ setCreateGroupModalIsOpen }) => {
  return (
    <Col xs="auto">
      <Button
        variant="outline-dark"
        onClick={() => setCreateGroupModalIsOpen(true)}
        size="sm"
        name="CreateGroupButton"
      >
        <IoAddCircle className={styles.icon} />
      </Button>
    </Col>
  );
};
