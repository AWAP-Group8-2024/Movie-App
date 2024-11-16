import { Card, Row, Col, Button } from "react-bootstrap";
import PrivateInfo from "./PrivateInfo";
import PublicInfo from "./PublicInfo";
import ProfileAction from "./ProfileAction";
import { EditButton } from "./Button";

export default function Body({
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
}) {
  return (
    <div className="mt-4">
      {/* Main Profile Area */}
      <Row className="mt-4">
        <Col md={3} className="d-flex justify-content-center">
          <Card style={{ width: "100%" }}>
            <Card.Body>something</Card.Body>
          </Card>
        </Col>

        {/* Right Column for Additional Content */}
        <Col md={8}>
          <Card style={{ width: "100%" }}>
            <Card.Body className="pt-0">
              <div className="d-flex justify-content-end pt-3">
                {isOwnProfile && <EditButton setIsEditing={setIsEditing} />}
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
      </Row>
    </div>
  );
}
