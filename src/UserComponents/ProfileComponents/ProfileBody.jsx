import { Row } from "react-bootstrap";
import { GroupCard, UserInfoCard } from "./BodyComponents/Cards";

export default function ProfileBody({
  profileData,
  isEditing,
  editData,
  handleInputChange,
  isOwnProfile,
  handleSave,
  handleCancel,
  handleLogout,
  setShowModal,
  setIsEditing,
  groupData,
  handleGroupClick,
}) {
  return (
    <div className="mt-4">
      <Row className="mt-4">
        <GroupCard groupData={groupData} handleGroupClick={handleGroupClick} />
        <UserInfoCard
          isOwnProfile={isOwnProfile}
          setIsEditing={setIsEditing}
          profileData={profileData}
          isEditing={isEditing}
          editData={editData}
          handleInputChange={handleInputChange}
          handleLogout={handleLogout}
          setShowModal={setShowModal}
          handleSave={handleSave}
          handleCancel={handleCancel}
        />
      </Row>
    </div>
  );
}
