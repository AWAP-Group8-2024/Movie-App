import { useState } from "react";
import { UserContext } from "./UserContext.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const url = process.env.REACT_APP_API_URL;

export default function UserProvider({ children }) {
  const userFromSessionStorage = sessionStorage.getItem("user");
  const [user, setUser] = useState(
    userFromSessionStorage
      ? JSON.parse(userFromSessionStorage)
      : { id: "", email: "" }
  );

  const navigate = useNavigate();

  const signUp = async () => {
    try {
      const response = await axios.post(`${url}/user/register`, user);
      setUser({ email: "", password: "" });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const signIn = async () => {
    try {
      const response = await axios.post(`${url}/user/login`, user);
      setUser(response.data);
      sessionStorage.setItem("user", JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      setUser({ email: "", password: "" });
      throw error;
    }
  };

  const removeAccount = async (email, password) => {
    try {
      const token = JSON.parse(sessionStorage.getItem("user"))?.token;
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      const body = {
        email,
        password,
      };
      const response = await axios.delete(`${url}/user/profile/${user.id}`, {
        headers,
        data: body,
      });
      sessionStorage.removeItem("user"); // Removes user from session storage after successful deletion
      setUser({ id: "", email: "", token: "" });
      navigate("/");
      window.location.reload();
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const getUserProfile = async (profileId) => {
    try {
      const token = JSON.parse(sessionStorage.getItem("user"))?.token;
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.post(
        `${url}/user/profile/${profileId}`,
        {},
        { headers }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return (
    <UserContext.Provider
      value={{ user, setUser, signUp, signIn, removeAccount, getUserProfile }}
    >
      {children}
    </UserContext.Provider>
  );
}
