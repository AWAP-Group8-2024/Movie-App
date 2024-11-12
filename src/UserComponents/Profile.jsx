import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useUser } from "./useUser.jsx";
import Navigation from "../components/Navigation.jsx";
import { Card, Container, Form, Button, Modal, Row, Col } from "react-bootstrap";

export default function Profile() {
	const { user, RemoveAccount, getUserProfile } = useUser();

	const navigate = useNavigate();
	const currentUrl = window.location.href;
	const profileId = currentUrl.match(/\/profile\/(\d+)/)?.[1];
	const [profileData, setprofileData] = useState(""); // Stores the resolved object
	useEffect(() => {
		getUserProfile(profileId).then((userProfile) => {
			setprofileData(userProfile);
		});
	}, [profileId]); // Only run when profileId changes
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showModal, setShowModal] = useState(false);

	const handleLogout = () => {
		sessionStorage.removeItem("user");
		navigate("/");
		window.location.reload();
	};

	const handleDelete = async () => {
		try {
			await RemoveAccount(email, password); // Passes email, password for verification
			alert("Account deleted successfully.");
		} catch (error) {
			const message =
				error.response?.data?.message || "Failed to delete account.";
			alert(message);
		}
	};

	return (
		<Container>
			<Navigation />
			<Row className="mt-4">
				{/* Profile Card on the left */}
				<Col md={3} className="d-flex justify-content-center">
					<Card style={{ width: "100%" }}>
						<Card.Img variant="top" src="holder.js/100px180" alt="Profile Image" />
						<Card.Body>
							<Card.Text>Email: {profileData.email}</Card.Text>{/*use profileData instead of user to see on logged out state*/}
							<Card.Text>Firstname: {profileData.firstname}</Card.Text>
							<Card.Text>Lastname: {profileData.lastname}</Card.Text>
							<Button variant="outline-primary" className="me-2"
								onClick={() => { try { navigator.clipboard.writeText(currentUrl); alert("URL copied to clipboard!"); } catch (error) { alert("Failed to copy URL."); } }}>Share</Button>
							<Button variant="outline-dark" disabled={!user || !user.token}>Edit</Button>
						</Card.Body>
					</Card>
				</Col>

				{/* Main content area in the center */}
				<Col md={8}>
					<div className="main-content mb-4">
						{/* Additional content goes here */}
					</div>
					{/* Logout and Delete Account Buttons */}
					<div className="d-flex flex-column align-items-start mt-3">
						<Button variant="outline-dark" onClick={handleLogout} className="mb-2">
							Log out
						</Button>
						<Button variant="outline-danger" onClick={() => setShowModal(true)}>
							Delete Account
						</Button>
					</div>
				</Col>
			</Row>

			{/* Modal for Account Deletion */}
			<Modal show={showModal} onHide={() => setShowModal(false)} centered>
				<Modal.Header closeButton>
					<Modal.Title>Confirm Account Deletion</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.Group>
							<Form.Control
								type="email"
								placeholder="Enter your email"
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</Form.Group>
						<Form.Group className="mt-3">
							<Form.Control
								type="password"
								placeholder="Enter your password"
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="danger" onClick={handleDelete} disabled={!email || !password}>
						Delete
					</Button>
					<Button variant="secondary" onClick={() => setShowModal(false)}>
						Cancel
					</Button>
				</Modal.Footer>
			</Modal>
		</Container>
	);
}
