import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { useUser } from "../UserComponents/useUser.js";
import { UserDropdown } from "./NavComponents";

export default function Navigation() {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();
  const { user, handleLogout } = useUser();

  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() !== "") {
      Promise.all([
        fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&query=${query}&page=1`
        ),
        fetch(
          `https://api.themoviedb.org/3/search/tv?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&query=${query}&page=1`
        ),
      ])
        .then(([movieRes, tvRes]) =>
          Promise.all([movieRes.json(), tvRes.json()])
        )
        .then(([movieData, tvData]) => {
          const combined = [
            ...movieData.results.map((item) => ({
              ...item,
              mediaType: "movie",
            })),
            ...tvData.results.map((item) => ({
              ...item,
              mediaType: "tv",
              title: item.name,
              release_date: item.first_air_date,
            })),
          ];
          setSuggestions(combined.slice(0, 5));
        })
        .catch((error) => console.error("Error fetching suggestions:", error));
    } else {
      setSuggestions([]);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // if (suggestions.length > 0) {
    //   const firstResult = suggestions[0];
    //   navigate(`/${firstResult.mediaType}/${firstResult.id}`);
    // } else {
    //   alert("No results found");
    // }

    window.location.replace(`/search/list/movie?query=${searchQuery}&page=1`);
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Movie App
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <NavDropdown title="Genres" id="basic-nav-dropdown">
              <NavDropdown.Item
                as={Link}
                onClick={() => {
                  window.location.replace("/filtered/movie?genres=12&page=1");
                }}
              >
                Adventure
              </NavDropdown.Item>
              <NavDropdown.Item
                as={Link}
                onClick={() => {
                  window.location.replace("/filtered/movie?genres=35&page=1");
                }}
              >
                Comedy
              </NavDropdown.Item>
              <NavDropdown.Item
                as={Link}
                onClick={() => {
                  window.location.replace("/filtered/movie?genres=18&page=1");
                }}
              >
                Drama
              </NavDropdown.Item>
              <NavDropdown.Item
                as={Link}
                onClick={() => {
                  window.location.replace("/filtered/movie?genres=27&page=1");
                }}
              >
                Horror
              </NavDropdown.Item>
              <NavDropdown.Item
                as={Link}
                onClick={() => {
                  window.location.replace(
                    "/filtered/movie?genres=10749&page=1"
                  );
                }}
              >
                Romance
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item
                as={Link}
                onClick={() => {
                  window.location.replace("/genres/list");
                }}
              >
                View more
              </NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Categories" id="basic-nav-dropdown">
              <NavDropdown.Item
                as={Link}
                onClick={() =>
                  window.location.replace("/list/movie_popular?page=1")
                }
              >
                Popular movies
              </NavDropdown.Item>
              <NavDropdown.Item
                as={Link}
                onClick={() =>
                  window.location.replace("/list/trending_movie_week?page=1")
                }
              >
                Trending movies
              </NavDropdown.Item>
              <NavDropdown.Item
                as={Link}
                onClick={() =>
                  window.location.replace("/list/tv_popular?page=1")
                }
              >
                Popular TV shows
              </NavDropdown.Item>
              <NavDropdown.Item
                as={Link}
                onClick={() => window.location.replace("/finnkino/list?page=1")}
              >
                FinnKino
              </NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Groups" id="groups-nav-dropdown">
              <NavDropdown.Item as={Link} to="/groups/all">
                View All Groups
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Form
            className="d-inline-flex position-relative"
            onSubmit={handleSearch}
          >
            <Row>
              <Col xs="auto">
                <Form.Control
                  type="text"
                  placeholder="Search Movies & TV Shows"
                  value={searchQuery}
                  onChange={handleInputChange}
                  className="mr-sm-2"
                  size="sm"
                />
              </Col>
              <Col xs="auto">
                <Button type="submit" variant="outline-success" size="sm">
                  Search
                </Button>
              </Col>
            </Row>
            {suggestions.length > 0 && (
              <ListGroup
                className="position-absolute w-100 mt-5"
                style={{ zIndex: 1000 }}
              >
                {suggestions.map((item) => (
                  <ListGroup.Item
                    key={item.id}
                    as={Link}
                    to={`/${item.mediaType}/${item.id}`}
                    action
                    className="d-flex align-items-center"
                  >
                    {item.poster_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w92${item.poster_path}`}
                        alt={item.title}
                        className="me-2"
                        style={{
                          width: "50px",
                          height: "75px",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div
                        className="me-2"
                        style={{
                          width: "50px",
                          height: "75px",
                          backgroundColor: "#ccc",
                        }}
                      />
                    )}
                    <div>
                      <div className="fw-bold">{item.title}</div>
                      <div
                        className="text-muted"
                        style={{ fontSize: "0.85em" }}
                      >
                        {item.mediaType === "movie" ? "Movie" : "TV Show"} •{" "}
                        {item.release_date
                          ? item.release_date.split("-")[0]
                          : "N/A"}
                      </div>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </Form>
          {user && user.token ? (
            <UserDropdown user={user} handleLogout={handleLogout} />
          ) : (
            <Button
              as={Link}
              to="/login"
              variant="outline-dark"
              size="sm"
              className="ms-4"
            >
              Log in
            </Button>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
