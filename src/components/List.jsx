import Navigation from "./Navigation"
import { useParams, useLocation, Link } from "react-router-dom"
import { useState, useEffect } from "react";
import { Row, Col, Container, Accordion, Button, Dropdown } from "react-bootstrap";
import { movieGenres } from "./movieGenres.js";
import { tvGenres } from "./tvGenres";
import { FaRegStar, FaStar } from "react-icons/fa";
import { getLink } from "../HomeComponents/FetchAPI";
import noImage from './images/noImage.png';

export default function List({ items, total_pages }) {
    let { condition } = useParams();
    if (!condition) {
        condition = '';
    }
    const location = useLocation();
    const searchQuery = new URLSearchParams(location.search);
    const page = +searchQuery.get('page');
    let currentGenres = searchQuery.get('genres');
    const currentYear = searchQuery.get('year') || '';
    if (currentGenres) {
        currentGenres = currentGenres.split(',');
    }
    const query = searchQuery.get('query');

    const [rating, setRating] = useState(+searchQuery.get('rating') === 1 ? 0 : +searchQuery.get('rating') || 0);
    const [genreIdList, setGenreIdList] = useState(currentGenres ? currentGenres : []);
    const [searchButton, setSearchButton] = useState(genreIdList.length === 0 && (currentYear === '' || currentYear === null) && rating === 0);
    const [year, setYear] = useState(currentYear);
    const [body, setBody] = useState(null);

    let turnPage = (
        <div
            className="justify-content-center d-flex w-100 mt-3 mb-4"
        >

            <Col
                xs={1}
                as={Link}
                onClick={() => {
                    window.location.replace(window.location.href.replace(`page=${page}`, `page=${page - 1}`))
                }}
                className="text-decoration-none text-dark text-center fw-bold"
            >
                {page === 1 ? null : `<`}
            </Col>

            <Col
                xs={1}
                className="text-center"
            >
                {page}
            </Col>

            <Col
                xs={1}
                as={Link}
                onClick={() => {
                    window.location.replace(window.location.href.replace(`page=${page}`, `page=${page + 1}`))
                }}
                className="text-decoration-none text-dark text-center fw-bold"
            >
                {page >= total_pages ? null : `>`}
            </Col>
        </div>
    );

    function createGenreFilter(element) {
        function checkClick(event) {
            if (event.target.checked) {
                setGenreIdList([...genreIdList, element.id]);
            } else {
                setGenreIdList(genreIdList.filter(item => !(+item === element.id)));
            }

            setSearchButton(false);
        }

        filterGenres.push(
            <Col
                key={element.id}
            >
                <input
                    type="checkbox"
                    className="me-2"
                    onChange={checkClick}
                    defaultChecked={currentGenres ? currentGenres.includes(element.id.toString()) : false}
                />
                <label>
                    {element.name}
                </label>
            </Col>
        );
    }

    function yearChange(event) {
        setYear(event.target.value);
        setSearchButton(false);
    } 

    let filterGenres = [];

    if (condition.includes('movie')) {
        movieGenres.forEach((element) => {
            createGenreFilter(element);
        })
    } else {
        tvGenres.forEach((element) => {
            createGenreFilter(element);
        })
    }

    let filterYear = (
        <input type="number" placeholder="Enter year" onChange={yearChange} value={year}/>
    );

    let stars = [];

    for (let i = 1; i < 11; i++) {
        if (i <= rating) {
            stars.push(<FaStar  key={i} onClick={() => {
                setRating(i);
                setSearchButton(false);
            }}/>);
        } else {
            stars.push(<FaRegStar key={i} onClick={() => {
                setRating(i);
                setSearchButton(false);
            }}/>);
        }
    }

    function createBody() {
        if (total_pages === -1) {
            setBody(<div>Failed to fetch. Try again later</div>);
            return;
        }
        let setter = [];
        items.forEach((element, i) => {
            setter.push(
                <Col
                    xs={6}
                    md={3}
                    className="text-decoration-none text-dark p-2"
                    as={Link}
                    to={element.title ? `/movie/${element.id}` : `/tv/${element.id}`} key={i}
                >
                    <div
                        className="border border-1 border-dark rounded p-2 text-center h-100 d-flex flex-column"
                    >
                        <img
                            src={element.poster_path === null ? noImage : `https://image.tmdb.org/t/p/w500${element.poster_path}`}
                            alt="failed to load poster"
                            className="img-fluid p-1"
                        />
                        <div
                            className="mt-auto"
                        >
                            {element.title ? element.title : element.name}
                        </div>
                    </div>
                </Col> 
            );
        });

        if (items.length === 0) {
            setBody(<Container>No results were found.</Container>);
        } else {
            setBody(
                <Container>
                    <Row className="d-flex align-items-stretch">
                        {setter}
                    </Row>
                </Container>
            );
        }
    }

    function createBodyFinKino() {
        if (total_pages === -1) {
            setBody(<div>Failed to fetch. Try again later</div>);
            return;
        }
        let setter = [];
        items.forEach(element => {
            setter.push(
                <Col xs={6} md={3} className="text-decoration-none text-dark p-2" as={Link} onClick={() => {getLink(element)}}>
                    <div className="border border-1 border-dark rounded p-2 text-center h-100 d-flex flex-column">
                        <img src={element.Images.EventLargeImagePortrait._text} alt="failed to fetch." className="img-fluid p-1"/>
                        {element.Title._text}
                    </div>
                </Col> 
            );
        });

        if (items.length === 0) {
            setBody(<Container>No results were found.</Container>);
        } else {
            setBody(
                <Container>
                    <Row className="d-flex align-items-stretch">
                        {setter}
                    </Row>
                </Container>
            );
        }
    }

    let filters = null;

    if (!window.location.href.includes('finnkino') && !window.location.href.includes('search')) {
        filters = (
            <Container
                className="mt-3 mb-2"
            >
                <Accordion defaultActiveKey={genreIdList.length === 0 && (currentYear === '' || currentYear == null) && rating === 0 ? '' : '0'}>
                    <Accordion.Item eventKey="0">
                        <Accordion.Header><Col className="fs-3">Filters</Col></Accordion.Header>
                        <Accordion.Body>
                            <Row className="row-cols-auto">
                                <Col className="fs-4">
                                    Genres:
                                </Col>
                            </Row>
                            <Row className="row-cols-auto">
                                {filterGenres}
                            </Row>
                            <Row className="row-cols-auto">
                                <Col className="fs-4">
                                    Release year:
                                </Col>
                            </Row>
                            <Row className="row-cols-auto">
                                {filterYear}
                            </Row>
                            <Row className="row-cols-auto">
                                <Col className="fs-4">
                                    Rating:
                                </Col>
                            </Row>
                            <Row className="row-cols-auto">
                                <Col className="fs-4">{stars}</Col>
                            </Row>
                            <Row className="justify-content-center row-cols-auto">
                                <Col>
                                    <Button variant="outline-dark" disabled={searchButton} onClick={() => {
                                        if (condition.includes('tv')) {
                                            window.location.replace(`/filtered/tv?genres=${genreIdList.join(',')}&year=${year}&rating=${rating}&page=1`)
                                        } else {
                                            window.location.replace(`/filtered/movie?genres=${genreIdList.join(',')}&year=${year}&rating=${rating}&page=1`)
                                        }
                                    }}>Show results</Button>
                                </Col>
                            </Row>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </Container>
        )
    }

    const contentType = (
        <div>
            <h1 className="text-center">Search results for: "{query}"</h1>
            <Container className="mt-2">
                <Dropdown>
                    <Dropdown.Toggle variant="dark" id="dropdown-basic">
                        {condition === 'tv' ? 'TV shows' : 'Movies'}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => {window.location.replace(`/search/list/movie?query=${query}&page=1`)}}>
                            Movies
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => {window.location.replace(`/search/list/tv?query=${query}&page=1`)}}>
                            TV shows
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </Container>
        </div>
    )

    useEffect(() => {
        if (window.location.href.includes('finnkino')) {
            createBodyFinKino();
        } else {
            createBody();
        }
    }, []);

    return (
        <div>
            <Navigation />
            
            {filters}
            {window.location.href.includes('search') ? contentType : null}
            {body}
            {turnPage}
        </div>
    )
}