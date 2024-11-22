import { Modal, Button, Col, Row } from "react-bootstrap";
import { useState, useEffect } from "react";
import {
  getUserJoinRequests,
  getGroupByGroupId,
  cancelJoinRequest,
} from "../../../../services/GroupServices";

export default function ViewJoinRequests() {
  const [show, setShow] = useState(false);
  const [body, setBody] = useState([<div key="loading">Loading...</div>]);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
  };

  function getRequests() {
    getUserJoinRequests().then((requests) => {
      if (requests.length === 0) {
        setBody(
          <Row key="no-requests">
            <Col>You have no pending requests!</Col>
          </Row>
        );
      } else {
        const setter = [
          <div key="header">
            <Row className="d-flex justify-content-between mb-2">
              <Col xs={4}>
                <div>Group name</div>
              </Col>
              <Col xs={4} className="d-flex justify-content-center">
                <div>Request time</div>
              </Col>
              <Col xs={4}></Col>
            </Row>
            <hr />
          </div>,
        ];
        requests.forEach(async (element, index) => {
          const group = await getGroupByGroupId(element.group_id);
          setter.push(
            <div key={element.group_id || `request-${index}`}>
              <Row className="d-flex justify-content-between mb-2">
                <Col xs={4} className="d-flex align-items-center">
                  {group.name}
                </Col>
                <Col
                  xs={4}
                  className="d-flex justify-content-center align-items-center"
                >
                  {formatDate(element.request_date)}
                </Col>
                <Col
                  xs={4}
                  className="d-flex justify-content-end align-items-center"
                >
                  <Button
                    variant="danger"
                    onClick={() => handleCancel(element)}
                  >
                    Cancel
                  </Button>
                </Col>
              </Row>
              <hr />
            </div>
          );
        });
        setBody(setter);
      }
    });
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    return `${date.getDate()} ${months[date.getMonth()]} ${date.getHours()}:${
      date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
    }`;
  }

  useEffect(getRequests, []);

  const handleCancel = async (element) => {
    try {
      await cancelJoinRequest(element.group_id);
      getRequests();
    } catch (error) {
      console.error("Error canceling join request:", error.message);
    }
  };

  return (
    <div>
      <Button variant="dark" className="mb-1 w-100" onClick={handleShow}>
        View your requests
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Your join requests</Modal.Title>
        </Modal.Header>
        <Modal.Body>{body}</Modal.Body>
      </Modal>
    </div>
  );
}
