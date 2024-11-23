import { Card, Row, Col } from "react-bootstrap";
import PrivateInfo from "./UserInfoCardComponents/PrivateInfo";
import PublicInfo from "./UserInfoCardComponents/PublicInfo";
import ProfileAction from "./UserInfoCardComponents/ProfileAction";
import { EditButton, ShareButton } from "./UserInfoCardComponents/Button";

export const UserInfoCard = ({
  isOwnProfile,
  setIsEditing,
  profileData,
  isEditing,
  editData,
  handleInputChange,
  handleLogout,
  setShowDeleteModal,
  handleSave,
  handleCancel,
  handleShare,
}) => {
  return (
    <>
      <Col md={9} className="mb-2">
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
                        setShowDeleteModal={setShowDeleteModal}
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
