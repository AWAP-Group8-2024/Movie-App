import { useState, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const url = process.env.REACT_APP_BACKEND_URL;

const initialUserState = { id: "", email: "", token: "", password: "" };

const UserContext = createContext({
  user: initialUserState,
  setUser: () => {},
});

export default function UserProvider({ children }) {
  const userFromSessionStorage = sessionStorage.getItem("user");
  const [user, setUser] = useState(
    userFromSessionStorage
      ? JSON.parse(userFromSessionStorage)
      : { id: "", email: "", token: "" }
  );

  const navigate = useNavigate();

  const signUp = async () => {
    try {
      const response = await axios.post(`${url}/user/register`, user);
      setUser({ id: "", email: "", token: "", password: "" });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const signIn = async () => {
    try {
      const response = await axios.post(`${url}/user/login`, user);
      setUser({ ...response.data, password: "" });
      sessionStorage.setItem("user", JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      setUser({ id: "", email: "", token: "", password: "" });
      throw error;
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    setUser({ id: "", email: "", token: "", password: "" });
    navigate("/");
  };

  const verifyIdentity = async (email, password) => {
    const token = user.token;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    const body = {
      email,
      password,
    };
    try {
      const response = await axios.post(`${url}/user/passwordCheck`, body, {
        headers,
      });
      return response.status === 200;
    } catch (error) {
      console.error(
        "Error verifying identity:",
        error.response?.data || error.message
      );
      return false;
    }
  };

  const removeAccount = async (email, password) => {
    try {
      const isIdentityCorrect = await verifyIdentity(email, password);
      if (!isIdentityCorrect) {
        throw new Error("Incorrect password.");
      }
      const token = user.token;
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.delete(`${url}/user/deleteAccount`, {
        headers,
      });
      handleLogout();
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const getUserProfile = async (profileId) => {
    try {
      const token = user.token;
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get(`${url}/user/profile/${profileId}`, {
        headers,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const updateUserProfile = async (updatedData) => {
    try {
      const token = user.token;
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.put(
        `${url}/user/profile/${user.id}`,
        updatedData,
        { headers }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        signUp,
        signIn,
        removeAccount,
        getUserProfile,
        updateUserProfile,
        handleLogout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
