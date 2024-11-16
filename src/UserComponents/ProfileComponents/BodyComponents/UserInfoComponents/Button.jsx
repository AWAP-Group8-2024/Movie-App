import styles from "./Button.module.css";
import { Col, Button } from "react-bootstrap";
import {
  IoLogOutOutline,
  IoTrashSharp,
  IoPencil,
  IoCheckmarkOutline,
  IoClose,
} from "react-icons/io5";

export const EditButton = ({ setIsEditing }) => {
  return (
    <Button
      variant="outline-dark"
      onClick={() => setIsEditing(true)}
      size="sm"
      name="Edit"
    >
      <IoPencil className={styles.icon} /> Edit Profile
    </Button>
  );
};

export const DeleteButton = ({ setShowModal }) => {
  return (
    <Col xs="auto">
      <Button
        variant="outline-danger"
        onClick={() => setShowModal(true)}
        size="sm"
        name="Delete"
      >
        <IoTrashSharp className={styles.icon} /> Delete Account
      </Button>
    </Col>
  );
};

export const LogoutButton = ({ handleLogout }) => {
  return (
    <Col xs="auto">
      <Button
        variant="outline-dark"
        onClick={handleLogout}
        size="sm"
        name="Logout"
      >
        <IoLogOutOutline className={styles.icon} /> Logout
      </Button>
    </Col>
  );
};

export const SaveButton = ({ handleSave }) => {
  return (
    <Col xs="auto">
      <Button
        variant="outline-success"
        onClick={handleSave}
        size="sm"
        name="Save"
      >
        <IoCheckmarkOutline className={styles.icon} /> Save
      </Button>
    </Col>
  );
};

export const CancelButton = ({ handleCancel }) => {
  return (
    <Col xs="auto">
      <Button
        variant="outline-secondary"
        onClick={handleCancel}
        size="sm"
        name="Cancel"
      >
        <IoClose className={styles.icon} /> Cancel
      </Button>
    </Col>
  );
};

export const GroupButton = ({ handleCancel }) => {
  return (
    <Col xs="auto">
      <Button
        variant="outline-secondary"
        onClick={handleCancel}
        size="sm"
        name="Cancel"
      >
        <IoClose className={styles.icon} /> Cancel
      </Button>
    </Col>
  );
};
