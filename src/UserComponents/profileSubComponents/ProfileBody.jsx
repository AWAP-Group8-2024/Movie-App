import { Card, Button, Row, Col, Form, CardBody } from "react-bootstrap";
import PrivateInfo from "./PrivateInfo";
import PublicInfo from "./PublicInfo";
import ProfileAction from "./ProfileAction";
import EditingForm from "./EditingForm";
export default function Body({
  profileData,
  isEditing,
  editData,
  handleInputChange,
  isOwnProfile,
  handleSave,
  handleCancel,
  handleLogout,
  showModal,
  setShowModal,
  handleDelete,
  userConfirm,
  setUserConfirm,
  setIsEditing,
}) {
  return (
    <div className="mt-4">
      {/* Main Profile Area */}
      <Row className="mt-4">
        {/* Left Column for Profile Details */}
        <Col md={3} className="d-flex justify-content-center">
          <Card style={{ width: "100%" }}>
            <Card.Body>something</Card.Body>
          </Card>
        </Col>

        {/* Right Column for Additional Content */}
        <Col md={8}>
          <Card style={{ width: "100%" }}>
            <Card.Body>
              <Row>
                {profileData ? (
                  <>
                    <PublicInfo profileData={profileData} />
                    {isEditing ? (
                      <EditingForm
                        editData={editData}
                        handleInputChange={handleInputChange}
                        handleSave={handleSave}
                        handleCancel={handleCancel}
                      />
                    ) : (
                      <>
                        {isOwnProfile && (
                          <>
                            <PrivateInfo profileData={profileData} />
                            <ProfileAction
                              handleLogout={handleLogout}
                              setShowModal={setShowModal}
                              setIsEditing={setIsEditing}
                            />
                          </>
                        )}
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

      {/* Example Rows for Spacing */}
      <Row className="background-black mt-4">
        <Col md={3}>
          <div className="p-3 bg-light">Extra Section 1</div>
        </Col>
        <Col md={3}>
          <div className="p-3 bg-light">Extra Section 2</div>
        </Col>
        <Col md={3}>
          <div className="p-3 bg-light">Extra Section 3</div>
        </Col>
      </Row>

      {/* Another Row Example */}
      <Row md={2} className="mt-3">
        <Col>
          <div className="p-3 bg-secondary text-white">Column 1</div>
        </Col>
        <Col>
          <div className="p-3 bg-secondary text-white">Column 2</div>
        </Col>
      </Row>
    </div>
  );
}
