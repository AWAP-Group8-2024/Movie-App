import { Row } from "react-bootstrap";
import { GroupCard } from "./BodyComponents/GroupCard";
import { FavoriteCard } from "./BodyComponents/FavoriteCard";
import { UserInfoCard } from "./BodyComponents/UserInfoCard";
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
    <div className="mt-2">
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
      <Row>
        <FavoriteCard />
      </Row>
    </div>
  );
}
