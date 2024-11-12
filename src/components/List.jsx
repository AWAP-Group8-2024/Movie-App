import Navigation from "./Navigation"
import { useParams, useLocation, Link } from "react-router-dom"
import { useState, useEffect } from "react";
import { Row, Col, Container, Accordion, Button } from "react-bootstrap";
import { movieGenres } from "./movieGenres.js";
import { tvGenres } from "./tvGenres";

export default function List({ items, total_pages }) {
    const { condition } =  useParams();
    const location = useLocation();
    const searchQuery = new URLSearchParams(location.search);
    const page = +searchQuery.get('page');
    let currentGenres = searchQuery.get('genres');
    if (currentGenres) {
        currentGenres = currentGenres.split(',');
    }
    const [genreIdList, setGenreIdList] = useState(currentGenres ? currentGenres : []);
    const [searchButton, setSearchButton] = useState(genreIdList == 0);
    
    const [body, setBody] = useState(null);

    let turnPage = (
        <Row className="justify-content-center row-cols-auto">
            {page === 1 ? null :
            <Col as={Link} onClick={() => {window.location.replace(window.location.href.replace(`page=${page}`, `page=${page - 1}`))}} className="text-decoration-none text-dark">{`<-`}</Col>}
            <Col>{page}</Col>
            {page >= total_pages ? null :
            <Col as={Link} onClick={() => {window.location.replace(window.location.href.replace(`page=${page}`, `page=${page + 1}`))}} className="text-decoration-none text-dark">{`->`}</Col>}
        </Row>
    );

    function createGenreFilter(element) {
        function checkClick(event) {
            if (event.target.checked) {
                setGenreIdList([...genreIdList, element.id]);
            } else {
                setGenreIdList(genreIdList.filter(item => !(item == element.id)));
            }

            setSearchButton(false);
        }

        filterGenres.push(
            <Col>
                <input type="checkbox" className="me-2" onChange={checkClick} defaultChecked={currentGenres ? currentGenres.includes(element.id.toString()) : false}/>
                <label>{element.name}</label>
            </Col>
        );
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

    function createBody() {
        if (total_pages == -1) {
            setBody(<div>Failed to fetch. Try again later</div>);
            return;
        }
        let setter = [];
        items.forEach(element => {
            setter.push(
                <Col xs={6} md={3} className="p-2" as={Link} to={element.title ? `/movie/${element.id}` : `/tv/${element.id}`}>
                    <div className="text-decoration-none text-dark border border-1 border-dark rounded p-2 text-center">
                        <img src={`https://image.tmdb.org/t/p/w500${element.poster_path}`} className="img-fluid p-1"/>
                        {element.title ? element.title : element.name}
                    </div>
                </Col> 
            );
        });

        if (items.length == 0) {
            setBody(<div>No results were found.</div>);
        } else {
            setBody(
                <Container>
                    <Row>
                        {setter}
                    </Row>
                </Container>
            );
        }
    }

    useEffect(createBody, []);
    return (
        <div>
            <Navigation />
            <Accordion defaultActiveKey={!genreIdList.length == 0 ? '0' : ''}>
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
                        <Row className="justify-content-center row-cols-auto">
                            <Col>
                                <Button variant="outline-dark" disabled={searchButton} onClick={() => {
                                    if (condition.includes('tv')) {
                                        window.location.replace(`/filtered/tv?genres=${genreIdList.join(',')}&page=1`)
                                    } else {
                                        window.location.replace(`/filtered/movie?genres=${genreIdList.join(',')}&page=1`)
                                    }
                                }}>Show results</Button>
                            </Col>
                        </Row>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
            {body}
            {turnPage}
        </div>
    )
}