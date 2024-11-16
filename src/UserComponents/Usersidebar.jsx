import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Sidebar from "react-bootstrap-sidebar-menu";
import {
  IoLogOutOutline,
  IoPersonCircleOutline,
  IoPeopleCircle,
  IoNavigate,
} from "react-icons/io5";
import { Button } from "react-bootstrap";
import { useUser } from "./UseUser";

export default function Usersidebar() {
  const [showSidebar, setShowSidebar] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  return (
    <div
      style={{ position: "relative", display: "inline-block" }}
      onMouseOver={() => setShowSidebar(true)}
      onMouseLeave={() => setShowSidebar(false)}
    >
      {/* Invisible Hover Container */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: -10, // Extend hover area to the left
          width: "220px", // Cover icon and sidebar width
          height: "300px", // Extend hover area height
          zIndex: 1,
        }}
        onMouseOver={() => setShowSidebar(true)}
        onMouseLeave={() => setShowSidebar(false)}
      />
      <IoPersonCircleOutline
        size={30}
        className="ms-0 ms-lg-2 mt-2 mt-lg-0"
        style={{ cursor: "pointer", position: "relative", zIndex: 2 }}
      />

      {/* Sidebar Menu */}
      {showSidebar && (
        <div
          style={{
            position: "absolute",
            top: "35px",
            left: 0,
            backgroundColor: "white",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            borderRadius: "5px",
            width: "200px",
            padding: "10px",
            zIndex: 2,
          }}
        >
          <Sidebar>
            <Sidebar.Nav>
              <Button
                as={Link}
                to={`/profile/${user.id}`}
                variant="outline-primary"
                name="profile"
                className="mb-2"
              >
                <IoNavigate /> Profile
              </Button>
              <Button
                as={Link}
                to="/groups"
                variant="outline-success"
                name="My groups"
                className="mb-2"
              >
                <IoPeopleCircle />
                My Groups
              </Button>
              <Button
                variant="outline-dark"
                onClick={handleLogout}
                name="Logout"
                clasName="mb2"
              >
                <IoLogOutOutline /> Logout
              </Button>
            </Sidebar.Nav>
          </Sidebar>
        </div>
      )}
    </div>
  );
}
