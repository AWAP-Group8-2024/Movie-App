import {
  Navbar,
  Nav,
  NavDropdown,
  Container,
  Form,
  Row,
  Col,
  Button,
  ListGroup,
} from "react-bootstrap";
import {
  IoLogOutOutline,
  IoPersonCircleOutline,
  IoPeopleSharp,
  IoNewspaper,
  IoLogOut,
} from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";

export const UserDropdown = ({ user, handleLogout }) => {
  return (
    <NavDropdown
      title={
        <IoPersonCircleOutline
          size={30}
          className="ms-lg-4 mt-lg-0"
          style={{ cursor: "pointer", position: "relative", zIndex: 2 }}
        />
      }
      id="user-nav-dropdown"
      align="end"
    >
      <NavDropdown.Item as={Link} to={`/profile/${user.id}`}>
        <span className="me-2">
          <IoNewspaper size={16} />
        </span>
        <label htmlFor="">My Profile</label>
      </NavDropdown.Item>
      <NavDropdown.Item as={Link} to="/groups/all">
        <span className="me-2">
          <IoPeopleSharp size={16} />
        </span>
        <label htmlFor="">My Groups</label>
      </NavDropdown.Item>
      <NavDropdown.Divider />
      <NavDropdown.Item onClick={handleLogout}>
        <span className="me-2">
          <IoLogOut size={20} />
        </span>
        <label htmlFor="">Logout</label>
      </NavDropdown.Item>
    </NavDropdown>
  );
};
