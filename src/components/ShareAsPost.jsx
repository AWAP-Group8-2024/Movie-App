import { Button, Modal } from "react-bootstrap";
import { useState } from "react";
import { createGroupPost } from "../services/GroupServices";

export default function ShareAsPost({ group, show, setShow, movie }) {
    const [textAreaValue, setTextAreaValue] = useState(
        `Let's watch "${movie.title}"! (${window.location.href})`
    );

    function createPost() {
        createGroupPost(group.id, textAreaValue)
        .then(() => {
            alert(`Shared ${movie.title} to ${group.name} successfully!`);
        }).catch(error => {
            console.error(error.message);
            alert(`Failed to share`)
        })
    }

    return (
        <>
            <Modal
                show={show}
                onHide={() => setShow(false)}
                size="lg"
                aria-labelledby="createPost"
            >
                <Modal.Header closeButton>
                <Modal.Title id="createPost">
                    Share with group: {group ? group.name : null}
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <textarea
                        className="form-control"
                        placeholder="Enter description"
                        value={textAreaValue}
                        rows={6}
                        onChange={(event) => {setTextAreaValue(event.target.value)}}
                    ></textarea>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={createPost}>Share</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}