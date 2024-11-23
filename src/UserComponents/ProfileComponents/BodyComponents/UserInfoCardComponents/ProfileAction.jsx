import { Row } from "react-bootstrap";
import { DeleteButton, LogoutButton, SaveButton, CancelButton } from "./Button";
export default function ProfileAction({
  handleLogout,
  setShowDeleteModal,
  isEditing,
  handleSave,
  handleCancel,
}) {
  return (
    <Row className="mt-3 ps-3 d-flex">
      {!isEditing ? (
        <div className="d-flex justify-content-between">
          <DeleteButton setShowDeleteModal={setShowDeleteModal} />
          <LogoutButton handleLogout={handleLogout} />
        </div>
      ) : (
        <>
          <SaveButton handleSave={handleSave} />
          <CancelButton handleCancel={handleCancel} />
        </>
      )}
    </Row>
  );
}
