import styles from "./Button.module.css";
import { Col, Button } from "react-bootstrap";
import {
  IoLogOutOutline,
  IoTrashSharp,
  IoPencil,
  IoCheckmarkOutline,
  IoClose,
  IoShareSocialSharp,
  IoAddCircle,
} from "react-icons/io5";

export const EditButton = ({ setIsEditing }) => {
  return (
    <Button
      variant="outline-dark"
      onClick={() => setIsEditing(true)}
      size="sm"
      name="Edit"
      className="me-2"
    >
      <IoPencil className={styles.icon} /> Edit
    </Button>
  );
};

export const ShareButton = ({ handleShare }) => {
  return (
    <Button
      variant="outline-primary"
      onClick={handleShare}
      size="sm"
      name="Share"
    >
      <IoShareSocialSharp className={styles.icon} /> Share
    </Button>
  );
};

export const DeleteButton = ({ setShowDeleteModal }) => {
  return (
    <Col xs="auto">
      <Button
        variant="outline-danger"
        onClick={() => setShowDeleteModal(true)}
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

// export const CreateGroupButton = ({ setShowCreateGroupModal }) => {
//   return (
//     <Col xs="auto">
//       <Button
//         variant="outline-dark"
//         onClick={() => setShowCreateGroupModal(true)}
//         size="sm"
//         name="CreateGroupButton"
//       >
//         <IoAddCircle className={styles.icon} />
//       </Button>
//     </Col>
//   );
// };
