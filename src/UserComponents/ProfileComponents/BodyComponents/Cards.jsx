import { Card, Row, Col } from "react-bootstrap";
import PrivateInfo from "./UserInfoComponents/PrivateInfo";
import PublicInfo from "./UserInfoComponents/PublicInfo";
import ProfileAction from "./UserInfoComponents/ProfileAction";
import { EditButton, ShareButton } from "./UserInfoComponents/Button";
import UserGroups from "./UserGroupComponents/UserGroups";

export const GroupCard = ({ groupData, handleGroupClick }) => {
  return (
    <>
      <Col md={3} className="d-flex justify-content-center">
        <Card style={{ width: "100%" }}>
          <Card.Body>
            <UserGroups
              groupData={groupData}
              handleGroupClick={handleGroupClick}
            />
          </Card.Body>
        </Card>
      </Col>
    </>
  );
};

export const UserInfoCard = ({
  isOwnProfile,
  setIsEditing,
  profileData,
  isEditing,
  editData,
  handleInputChange,
  handleLogout,
  setShowModal,
  handleSave,
  handleCancel,
  handleShare,
}) => {
  return (
    <>
      <Col md={9}>
        <Card style={{ width: "100%" }}>
          <Card.Body className="pt-0">
            <div className="d-flex justify-content-end pt-3">
              {isOwnProfile && <EditButton setIsEditing={setIsEditing} />}
              <ShareButton handleShare={handleShare} />
            </div>
            <Row>
              {profileData ? (
                <>
                  <PublicInfo profileData={profileData} />
                  {isOwnProfile && (
                    <>
                      <PrivateInfo
                        profileData={isEditing ? editData : profileData}
                        isEditing={isEditing}
                        handleInputChange={handleInputChange}
                        setIsEditing={setIsEditing}
                      />
                      <ProfileAction
                        handleLogout={handleLogout}
                        setShowModal={setShowModal}
                        isEditing={isEditing}
                        handleSave={handleSave}
                        handleCancel={handleCancel}
                      />
                    </>
                  )}
                </>
              ) : (
                <Card.Text>Loading profile...</Card.Text>
              )}
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </>
  );
};

export const FavoriteCard = () => {
  return (
    <>
      <Col md={12} className="d-flex justify-content-center">
        <Card style={{ width: "100%" }}>
          <Card.Body>FavoriteCard</Card.Body>
        </Card>
      </Col>
    </>
  );
};
