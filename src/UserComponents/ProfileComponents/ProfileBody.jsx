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
  setShowModal,
  setIsEditing,
  groupData,
  handleGroupClick,
  handleShare,
}) {
  return (
    <div className="mt-4">
      <Row>
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
          handleShare={handleShare}
        />
      </Row>
      <Row className="mt-4">
        <FavoriteCard />
      </Row>
    </div>
  );
}
