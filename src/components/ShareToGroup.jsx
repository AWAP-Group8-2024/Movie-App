import { useState, useEffect } from "react";
import { Button, Modal, Row, Col } from "react-bootstrap";
import { getGroupsByUserId } from "../services/GroupServices";
import { Link } from "react-router-dom";

export default function ShareToGroup({ setShowCreatePost, setGroup }) {
    const [show, setShow] = useState(false);
    const [groups, setGroups] = useState([]);
    const [errMsg, setErrMsg] = useState(<></>);

    function getGroups() {
        const userId = JSON.parse(sessionStorage.getItem("user"))?.id;
        getGroupsByUserId(userId)
        .then(res => {
            setGroups(res);
        })
        .catch(error => {
            console.error(error.message);
            setErrMsg(
                <Row className="row-cols-auto d-flex flex-column align-items-center">
                    <Col className="fw-bold fs-4 mb-3">
                        Only logged in users can share to groups
                    </Col>
                    <Col>
                        <Button as={Link} to={`/login`}>Log in</Button>
                    </Col>
                </Row>
            );
        })
    }

    useEffect(getGroups, []);

    return (
        <>
            <Button variant="dark" className="w-100 mt-2" onClick={() => setShow(true)}>
                Share to group
            </Button>

            <Modal
                show={show}
                onHide={() => setShow(false)}
                size="lg"
                aria-labelledby="chooseGroup"
            >
                <Modal.Header closeButton>
                <Modal.Title id="chooseGroup">
                    Choose group to share with
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row className="row-cols-auto">
                        {groups.map((element, i) => {
                            return (
                                <Col key={i} xs={3} className='p-2 fs-4'>
                                    <div
                                        className='border border-1 border-dark rounded p-2 h-100 d-flex align-items-center justify-content-center text-center flex-column'
                                    >
                                        <div className="h-100 d-flex align-items-center mb-3">
                                            {element.name}
                                        </div>
                                        <Button
                                            className="mt-auto"
                                            variant="primary"
                                            onClick={() => {
                                                setGroup(element);
                                                setShow(false);
                                                setShowCreatePost(true)
                                            }}
                                        >
                                            Share
                                        </Button>
                                    </div>
                                </Col>
                            )
                        })}
                    </Row>
                    {errMsg}
                </Modal.Body>
            </Modal>
        </>
    );
}