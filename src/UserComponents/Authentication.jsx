import { Link, useNavigate } from "react-router-dom";
import { useUser } from './useUser.jsx';

export const AuthenticationMode = Object.freeze({
	Login: 'Login',
	Register: 'Register'
})

export default function Authentication({ authenticationMode }) {
	const { user, setUser, signUp, signIn } = useUser();
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (authenticationMode === AuthenticationMode.Register) {
				await signUp();
				navigate('/login');
			} else {
				await signIn();
				navigate('/');
			}
		} catch (error) {
			const message = error.response && error.response.data ? error.response.data.error : error;
			alert(message);
		}
	}

	return (
		<div>
			<h3>{authenticationMode === AuthenticationMode.Login ? 'Login' : 'Register'}</h3>
			<form onSubmit={handleSubmit}>
				<div>
					<label>Email</label>
					<input type='email' value={user.email} onChange={e => setUser({ ...user, email: e.target.value })} />
				</div>
				<div>
					<label>Password</label>
					<input type='password' value={user.password} onChange={e => setUser({ ...user, password: e.target.value })} />
				</div>
				<div>
					<button>{authenticationMode === AuthenticationMode.Login ? 'Login' : 'Submit'}</button>
				</div>
				<div>
					<Link to={authenticationMode === AuthenticationMode.Login ? '/register' : '/login'}>
						{authenticationMode === AuthenticationMode.Login ? 'No account? Register' : 'Already registered? Login'}
					</Link>
				</div>
			</form>
		</div>
	)
}
