import React, { useState, useEffect } from "react";
import { createNewGroup } from "../../services/GroupServices";
import { useNavigate } from "react-router-dom";
import Navigation from "../Navigation";

const CreateGroupForm = () => {
	const [userId, setUserId] = useState(null);
	const [error, setError] = useState(null);
	const [message, setMessage] = useState("");
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		const user = JSON.parse(sessionStorage.getItem("user"));
		if (!user?.id) {
			if (!sessionStorage.getItem("alertShown")) {
				alert("You have to login to view Groups.");
				sessionStorage.setItem("alertShown", "true");
			}
			navigate("/login");
		} else {
			setUserId(user.id);
		}
	}, [navigate]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!name.trim()) {
			setError("Group name is required");
			return;
		}
		try {
			const newGroup = await createNewGroup({
				name: name,
				description: description,
			});
			setMessage(`Group "${newGroup.name}" created successfully!`);
			alert(`Group "${newGroup.name}" created successfully!`);
			setName("");
			setDescription("");
			navigate(`/groups/${newGroup.id}`);
		} catch (err) {
			setError("Error creating group");
		}
	};

	// Render the form only if userId is set
	if (!userId) {
		return <div>Redirecting...</div>;
	}

	return (
		<div>
			<Navigation />
			<h2 className="text-center mt-5 mb-4">Create a New Group</h2>
			{error && <div className="alert alert-danger">{error}</div>}
			{message && <div className="alert alert-success">{message}</div>}
			<form onSubmit={handleSubmit} className="container mt-5">
				<div className="mb-3">
					<input
						type="text"
						className="form-control"
						placeholder="Enter group name"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
				</div>
				<div className="mb-3">
					<textarea
						className="form-control"
						placeholder="Enter group description"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
					/>
				</div>
				<button type="submit" className="btn btn-primary w-100">
					Create Group
				</button>
			</form>
		</div>
	);
};

export default CreateGroupForm;
