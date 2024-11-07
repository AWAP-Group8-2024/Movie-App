import { useNavigate } from "react-router-dom";
import { useUser } from './useUser.jsx';
import { Button } from 'react-bootstrap';

export default function Profile() {
    const { RemoveAccount } = useUser();
    const navigate = useNavigate();

    const handleLogout = () => {
        sessionStorage.removeItem("user");
        navigate("/");
        window.location.reload();
    };
    const handleDelete = () => {
        RemoveAccount();
        sessionStorage.removeItem("user"); // Removes user from session storage after successful deletion
        navigate("/");
        window.location.reload();
    };
    return (
        <div>
            <Button variant="outline-dark" size='sm' className="ms-0 ms-lg-2 mt-2 mt-lg-0" onClick={handleLogout}>Log out</Button>
            <Button variant="outline-danger" size='sm' className="ms-0 ms-lg-2 mt-2 mt-lg-0" onClick={handleDelete}>Delete Account</Button>
        </div>
    )
}
