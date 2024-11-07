import Navigation from "./Navigation"
import { useParams, useLocation, Link } from "react-router-dom"
import { useState, useEffect } from "react";
import { Row, Col, Container } from "react-bootstrap";

export default function List() {
    const { condition } =  useParams();
    const location = useLocation();
    const searchQuery = new URLSearchParams(location.search);
    const [movies, setMovies] = useState(<Container>Loading...</Container>);
    
    const page = +searchQuery.get('page');

    let turnPage = null;

    if (page === 1) {
        turnPage = (
            <Row className="justify-content-center row-cols-auto">
                <Col>{page}</Col>
                <Col as={Link} onClick={() => {window.location.replace(`/list/${condition}?page=${page + 1}`)}} className="text-decoration-none text-dark">{`->`}</Col>
            </Row>
        );
    } else {
        turnPage = (
            <Row className="justify-content-center row-cols-auto">
                <Col as={Link} onClick={() => {window.location.replace(`/list/${condition}?page=${page - 1}`)}} className="text-decoration-none text-dark">{`<-`}</Col>
                <Col>{page}</Col>
                <Col as={Link} onClick={() => {window.location.replace(`/list/${condition}?page=${page + 1}`)}} className="text-decoration-none text-dark">{`->`}</Col>
            </Row>
        );
    }

    function getItems() {
        fetch(`https://api.themoviedb.org/3/${condition.replaceAll('_','/')}?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&page=${page}`)
        .then(res => res.json())
        .then(json => {
            const items = json.results;
            let setter = [];
            items.forEach(element => {
                setter.push(
                    <Col xs={6} md={3} className="p-2" as={Link} to={element.title ? `/movie/${element.id}` : `/tv/${element.id}`}>
                        <div className="text-decoration-none text-dark border border-1 border-dark rounded p-2 text-center">
                            <img src={`https://image.tmdb.org/t/p/w500${element.poster_path}`} className="img-fluid p-1"/>
                            {element.title ? element.title : element.name}
                        </div>
                    </Col>
                )
            });
            setMovies(
                <Container>
                    <Row>
                        {setter}
                    </Row>
                </Container>
            )
        })
    }

    useEffect(getItems, []);

    return (
        <div>
            <Navigation />
            {movies}
            {turnPage}
        </div>
    )
}