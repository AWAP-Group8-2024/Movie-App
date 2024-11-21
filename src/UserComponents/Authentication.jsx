import { Link, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useUser } from "./UseUser";
import Navigation from "../components/Navigation.jsx";
import "./Authentication.css";
import { useState } from "react";

export const AuthenticationMode = Object.freeze({
  Login: "Login",
  Register: "Register",
});

export default function Authentication({ authenticationMode }) {
  const { user, setUser, signUp, signIn } = useUser();
  const navigate = useNavigate();
  const [password, setPassword] = useState(""); // Local password state

  const handleClick = async (e) => {
    e.preventDefault();
    const userData = { ...user, password }; // Include password for sign-up/sign-in
    try {
      if (authenticationMode === AuthenticationMode.Register) {
        await signUp(userData);
        navigate("/login");
      } else {
        await signIn();
        navigate("/");
      }
    } catch (error) {
      const message =
        error.response && error.response.data
          ? error.response.data.error
          : error;
      alert(message);
    }
  };

  return (
    <div>
      <Navigation />
      <div className="auth_container">
        <div className="auth_title">
          {authenticationMode === AuthenticationMode.Login
            ? "Login"
            : "Register"}
        </div>
        <form className="auth_form">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={user.email}
              onChange={(e) =>
                setUser((prevUser) => ({ ...prevUser, email: e.target.value }))
              }
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={user.password || ""}
              onChange={(e) =>
                setUser((prevUser) => ({
                  ...prevUser,
                  password: e.target.value,
                }))
              }
            />
          </div>
          <div align="center">
            {authenticationMode === AuthenticationMode.Login ? (
              <Button
                variant="dark"
                className="ms-0 ms-lg-2 mt-2 mt-lg-0"
                onClick={handleClick}
              >
                Log in
              </Button>
            ) : (
              <Button
                variant="success"
                className="ms-0 ms-lg-2 mt-2 mt-lg-0"
                onClick={handleClick}
              >
                Submit
              </Button>
            )}
          </div>
          <div align="center">
            <Link
              to={
                authenticationMode === AuthenticationMode.Login
                  ? "/register"
                  : "/login"
              }
            >
              {authenticationMode === AuthenticationMode.Login
                ? "No account? Register"
                : "Already registered? Login"}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
