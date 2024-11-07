import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, NavDropdown, Container, Form, Row, Col, Button, ListGroup } from 'react-bootstrap';
import { useUser } from "../UserComponents/useUser";

export default function Navigation() {
	const [searchQuery, setSearchQuery] = useState("");
	const [suggestions, setSuggestions] = useState([]);
	const navigate = useNavigate();
	const { user } = useUser();

	const handleInputChange = (e) => {
		const query = e.target.value;
		setSearchQuery(query);

		if (query.trim() !== "") {
			Promise.all([
				fetch(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&query=${query}&page=1`),
				fetch(`https://api.themoviedb.org/3/search/tv?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&query=${query}&page=1`)
			])
				.then(([movieRes, tvRes]) => Promise.all([movieRes.json(), tvRes.json()]))
				.then(([movieData, tvData]) => {
					const combined = [
						...movieData.results.map(item => ({
							...item,
							mediaType: 'movie'
						})),
						...tvData.results.map(item => ({
							...item,
							mediaType: 'tv',
							title: item.name,
							release_date: item.first_air_date
						}))
					];
					setSuggestions(combined.slice(0, 5));
				})
				.catch(error => console.error("Error fetching suggestions:", error));
		} else {
			setSuggestions([]);
		}
	};

	const handleSearch = (e) => {
		e.preventDefault();
		if (suggestions.length > 0) {
			const firstResult = suggestions[0];
			navigate(`/${firstResult.mediaType}/${firstResult.id}`);
		} else {
			alert("No results found");
		}
	};

	return (
		<Navbar expand="lg" className="bg-body-tertiary">
			<Container>
				<Navbar.Brand as={Link} to="/">Movie App</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="me-auto">
						<NavDropdown title="Genres" id="basic-nav-dropdown">
							<NavDropdown.Item as={Link} to="#">Genre 1</NavDropdown.Item>
							<NavDropdown.Item as={Link} to="#">Genre 2</NavDropdown.Item>
							<NavDropdown.Item as={Link} to="#">Genre 3</NavDropdown.Item>
						</NavDropdown>
						<NavDropdown title="Categories" id="basic-nav-dropdown">
							<NavDropdown.Item as={Link} onClick={() => window.location.replace('/list/movie_popular?page=1')}>Popular movies</NavDropdown.Item>
							<NavDropdown.Item as={Link} onClick={() => window.location.replace('/list/trending_movie_week?page=1')}>Trending movies</NavDropdown.Item>
							<NavDropdown.Item as={Link} onClick={() => window.location.replace('/list/tv_popular?page=1')}>Popular TV shows</NavDropdown.Item>
						</NavDropdown>
					</Nav>
					<Form inline className="position-relative" onSubmit={handleSearch}>
						<Row>
							<Col xs="auto">
								<Form.Control
									type="text"
									placeholder="Search Movies & TV Shows"
									value={searchQuery}
									onChange={handleInputChange}
									className="mr-sm-2"
								/>
							</Col>
							<Col xs="auto">
								<Button type="submit" variant="outline-success">Search</Button>
							</Col>
						</Row>
						{suggestions.length > 0 && (
							<ListGroup className="position-absolute w-100 mt-1" style={{ zIndex: 1000 }}>
								{suggestions.map((item) => (
									<ListGroup.Item key={item.id} as={Link} to={`/${item.mediaType}/${item.id}`} action className="d-flex align-items-center">
										{item.poster_path ? (
											<img
												src={`https://image.tmdb.org/t/p/w92${item.poster_path}`}
												alt={item.title}
												className="me-2"
												style={{ width: "50px", height: "75px", objectFit: "cover" }}
											/>
										) : (
											<div className="me-2" style={{ width: "50px", height: "75px", backgroundColor: "#ccc" }} />
										)}
										<div>
											<div>{item.title}</div>
											<div className="text-muted" style={{ fontSize: "0.9em" }}>
												{item.release_date ? item.release_date.split("-")[0] : "N/A"}
                                                <span className="ms-2 badge bg-secondary">
                                                    {item.mediaType === 'movie' ? 'Movie' : 'TV Series'}
                                                </span>
											</div>
										</div>
									</ListGroup.Item>
								))}
							</ListGroup>
						)}
					</Form>
					{!user || !user.token ? (
						<Button as={Link} to="/login" variant="outline-dark" className="ms-0 ms-lg-5 mt-2 mt-lg-0">
							Log in
						</Button>
					) : (<Button
						variant="outline-dark"
						className="ms-0 ms-lg-5 mt-2 mt-lg-0"
						onClick={() => {
							sessionStorage.removeItem("user");
							navigate("/");
							window.location.reload();
						}}>Log out</Button>)}
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
}