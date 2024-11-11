import { useState } from "react";
import { UserContext } from "./UserContext.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const url = process.env.REACT_APP_API_URL;

export default function UserProvider({ children }) {
	const userFromSessionStorage = sessionStorage.getItem("user");
	const [user, setUser] = useState(userFromSessionStorage ? JSON.parse(userFromSessionStorage) : { id: "", email: "", password: "" });

	const navigate = useNavigate();

	const signUp = async () => {
		const json = JSON.stringify(user);
		const headers = { headers: { "Content-Type": "application/json" } };
		try {
			await axios.post(url + '/user/register', json, headers);
			setUser({ email: "", password: "" });
		} catch (error) {
			throw error;
		}
	}

	const signIn = async () => {
		const json = JSON.stringify(user);
		const headers = { headers: { "Content-Type": "application/json" } };
		try {
			const response = await axios.post(url + '/user/login', json, headers);
			setUser(response.data);
			sessionStorage.setItem("user", JSON.stringify(response.data));
		} catch (error) {
			setUser({ email: "", password: "" });
			throw error;
		}
	}

	const RemoveAccount = async (email, password) => {
		try {
			const token = JSON.parse(sessionStorage.getItem("user"))?.token;
			const headers = {
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${token}`,
					"email": email,
					"password": password
				},
			};
			const response = await axios.delete(`${url}/user/profile/${user.id}`, headers);
			sessionStorage.removeItem("user"); // Removes user from session storage after successful deletion
			navigate("/");
			window.location.reload();
			return response.data;
		} catch (error) {
			throw error;
		}
	};
	return (
		<UserContext.Provider value={{ user, setUser, signUp, signIn, RemoveAccount }}>
			{children}
		</UserContext.Provider>
	);
}