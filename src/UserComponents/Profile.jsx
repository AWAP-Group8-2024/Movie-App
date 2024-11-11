import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useUser } from './useUser.jsx';
import Navigation from '../components/Navigation.jsx';
import { Container, Form, Button } from 'react-bootstrap';

export default function Profile() {
	const { RemoveAccount } = useUser();
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleLogout = () => {
		sessionStorage.removeItem("user");
		navigate("/");
		window.location.reload();
	};
	const openModal = () => {
		document.getElementById("modal").style.display = "block";
	}
	const closeModal = () => {
		document.getElementById("modal").style.display = "none";
	}
	const handleDelete = async () => {
		try {
			await RemoveAccount(email, password); // Passes email, password for verification
			alert("Account deleted successfully.");
			navigate("/");
			window.location.reload();
		} catch (error) {
			const message = error.response && error.response.data ? error.response.data.error : error;
			alert(message);
		}
	};

	return (
		<Container>
			<Navigation />
			<Form align='center' inline className="position-relative">
				<Button variant="outline-dark" className="ms-0 ms-lg-2 mt-2 mt-lg-0" onClick={handleLogout}>Log out</Button>
				<Button variant="outline-danger" className="ms-0 ms-lg-2 mt-2 mt-lg-0" onClick={openModal}>Delete Account</Button>
				<div id="modal" className="modal">
					<div className="modal-content">
						<span className="close" align="right" onClick={closeModal}>&times;</span>
						<p>Are you sure you want to delete your account?</p>
						<Form align='center'>
							<div>
								<input type='email' style={{ width: '40%', marginBottom: '1rem' }} placeholder='Email' onChange={e => setEmail(e.target.value)} />
							</div>
							<div>
								<input type='password' style={{ width: '40%', marginBottom: '1rem' }} placeholder='Password' onChange={e => setPassword(e.target.value)} />
							</div>
							<Button variant="outline-danger" style={{ width: '20%' }} className="ms-0 ms-lg-2 mt-2 mt-lg-0" onClick={handleDelete} disabled={!email || !password}>Delete</Button>
							<Button variant="outline-dark" style={{ width: '20%' }} className="ms-0 ms-lg-2 mt-2 mt-lg-0" onClick={closeModal}>Cancel</Button>
						</Form>
					</div>
				</div>
			</Form>
		</Container>
	)
}
