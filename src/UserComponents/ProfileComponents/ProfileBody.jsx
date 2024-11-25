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
  handleShare,
  setCreateGroupModalIsOpen,
}) {
  return (
    <div className="mt-2">
      <Row>
        <GroupCard
          setCreateGroupModalIsOpen={setCreateGroupModalIsOpen}
          isOwnProfile={isOwnProfile}
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
      <Row className="mb-3">
        <FavoriteCard isOwnProfile={isOwnProfile} />
      </Row>
    </div>
  );
}
