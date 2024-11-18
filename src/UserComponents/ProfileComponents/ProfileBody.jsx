import { Row } from "react-bootstrap";
import { FavoriteCard, GroupCard, UserInfoCard } from "./BodyComponents/Cards";

export default function ProfileBody({
  profileData,
  isEditing,
  editData,
  handleInputChange,
  isOwnProfile,
  handleSave,
  handleCancel,
  handleLogout,
  setShowDeleteModal,
  setIsEditing,
  groupData,
  handleGroupClick,
  handleShare,
  setShowCreateGroupModal,
}) {
  return (
    <div className="mt-4">
      <Row>
        <GroupCard
          groupData={groupData}
          handleGroupClick={handleGroupClick}
          setShowCreateGroupModal={setShowCreateGroupModal}
        />
        <UserInfoCard
          isOwnProfile={isOwnProfile}
          setIsEditing={setIsEditing}
          profileData={profileData}
          isEditing={isEditing}
          editData={editData}
          handleInputChange={handleInputChange}
          handleLogout={handleLogout}
          setShowDeleteModal={setShowDeleteModal}
          handleSave={handleSave}
          handleCancel={handleCancel}
          handleShare={handleShare}
        />
      </Row>
      <Row className="mt-4">
        <FavoriteCard />
      </Row>
    </div>
  );
}
