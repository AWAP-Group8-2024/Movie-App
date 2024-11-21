import React, { useEffect, useState } from "react";
import {
	createNewGroup,
	getAllGroups,
	getGroupsByUserId,
	sendJoinRequest,
} from "../../Services/GroupServices";
import { useNavigate } from "react-router-dom";
import Navigation from "../Navigation";

const GroupList = ({ fetchType }) => {
	const [groups, setGroups] = useState([]);
	const [name, setName] = useState("");
	const [userId, setUserId] = useState(0);
	const [filteredGroups, setFilteredGroups] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [userGroups, setUserGroups] = useState([]); // To store the groups the user has joined
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [message, setMessage] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		const fetchGroups = async () => {
			try {
				const user = JSON.parse(sessionStorage.getItem("user")); // Get user data from sessionStorage
				if (!user?.id) {
					if (!sessionStorage.getItem("alertShown")) {
						alert("You have to login to view Groups.");
						sessionStorage.setItem("alertShown", "true");
					}
					navigate("/login"); // Redirect to login page if user is not authenticated
					return; // Stop further execution
				}
				setUserId(user.id);

				const groupsData = await getAllGroups();
				setGroups(groupsData);
				const userGroupData = await getGroupsByUserId(user.id);
				setUserGroups(userGroupData);

				// Filter out groups the user has joined or is the owner of
				const availableGroups = groupsData.filter(
					(group) =>
						!userGroupData.some((userGroup) => userGroup.id === group.id) &&
						group.creator_id !== user.id
				);

				setFilteredGroups(availableGroups);
			} catch (err) {
				setError("Failed to fetch groups");
				console.error("Error fetching groups:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchGroups();
	}, [navigate]); // Add `navigate` as a dependency


	const handleSearch = (e) => {
		setSearchTerm(e.target.value);

		// Filter groups based on the search term
		const results = groups.filter((group) =>
			group.name.toLowerCase().includes(e.target.value.toLowerCase())
		);

		// Filter out groups the user has joined or is the owner of
		const filteredResults = results.filter(
			(group) =>
				!userGroups.some((userGroup) => userGroup.id === group.id) &&
				group.creator_id !== userId // Replace with actual user ID
		);

		setFilteredGroups(filteredResults);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!name.trim()) {
			setError("Group name is required");
			return;
		}
		try {
			const newGroup = await createNewGroup({ name });
			setMessage(`Group ${newGroup.name} created!`);
			setName("");
			// Optionally, you can navigate or update group list after creating
		} catch (error) {
			setError("Error creating group");
		}
	};

	const handleJoinGroup = async (groupId) => {
		try {
			await sendJoinRequest(groupId); // Pass groupId directly here
			navigate("/groups/all");
			setMessage("Join request sent successfully.");
		} catch (err) {
			if (err.message === "User not authenticated") {
				navigate("/login");
			} else if (err.message === "User already in group") {
				setError("You are already a member of this group.");
			} else if (err.message === "Join request already sent") {
				setError("You have already sent a join request to this group.");
			} else if (err.message === "User is the creator of the group") {
				setError("You are the creator of this group.");
			} else {
				setError("Failed to join group.");
				console.error(err);
			}
		}
	};

	if (loading) return <div className="text-center">Loading...</div>;
	if (error) return <div className="alert alert-danger">{error}</div>;
	if (message) return <div className="alert alert-success">{message}</div>;

	return (
		<div>
			<Navigation />
			<div className="container mt-5">
				{fetchType === "user" ? (
					<>
						<h2>Your Groups</h2>
						<div className="row">
							{userGroups.length === 0 ? (
								<p>You haven't joined any groups yet.</p>
							) : (
								userGroups.map((group) => (
									<div key={group.id} className="col-md-4 mb-3">
										<div className="card">
											<div className="card-body">
												<h5 className="card-title">{group.name}</h5>
												<p className="card-text">Created by {group.creator_id}</p>
												<a
													href={`/groups/${group.id}`}
													className="btn btn-dark mt-2 mx-2"
												>
													View Group
												</a>
											</div>
										</div>
									</div>
								))
							)}
						</div>
					</>
				) : (
					<>
						<h2>Search Groups</h2>
						{message && <div className="alert alert-success">{message}</div>}
						{error && <div className="alert alert-danger">{error}</div>}

						<div className="mb-4">
							<input
								type="text"
								className="form-control"
								placeholder="Search by group name"
								value={searchTerm}
								onChange={handleSearch}
							/>
						</div>
						<h2>Available Groups</h2>
						<div className="row">
							{filteredGroups.length === 0 ? (
								<p>No available groups found.</p>
							) : (
								filteredGroups.map((group) => (
									<div key={group.id} className="col-md-4 mb-3">
										<div className="card">
											<div className="card-body">
												<h5 className="card-title">{group.name}</h5>
												<p className="card-text">Created by {group.creator_id}</p>
												<a
													href={`/groups/${group.id}`}
													className="btn btn-dark mt-2 mx-2"
												>
													View Group
												</a>
												<button
													className="btn btn-primary mt-2"
													onClick={() => handleJoinGroup(group.id)}
												>
													Join Group
												</button>
											</div>
										</div>
									</div>
								))
							)}
						</div>
						<h2>Create a New Group</h2>
						<form onSubmit={handleSubmit}>
							<div className="mb-3">
								<input
									type="text"
									className="form-control"
									placeholder="Enter group name"
									value={name}
									onChange={(e) => setName(e.target.value)}
								/>
							</div>
							<button type="submit" className="btn btn-primary">
								Create Group
							</button>
						</form>
					</>
				)}
			</div>
		</div>
	);
};

export default GroupList;
