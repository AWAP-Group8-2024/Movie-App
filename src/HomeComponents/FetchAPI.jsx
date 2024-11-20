import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { xml2json } from "xml-js";

function shuffle(arr) {
    let storage = null;
    let randomNumber = null;
    for (let i = 0; i < arr.length; i++) {
        randomNumber = Math.floor(Math.random() * arr.length);
        storage = arr[randomNumber];
        arr[randomNumber] = arr[i];
        arr[i] = storage
    }
    return arr;
}

async function getLink(item) {
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&query=${item.OriginalTitle._text}&page=1`)
    .then(res => res.json())
    .then(json => {
        let found = false;
        if (json.results.length > 0) {
            json.results.forEach(element => {
                if (element.release_date.replaceAll(/[-].+/g,'') == item.ProductionYear._text) {
                    const id = element.id;
                    if (!found) {
                        window.location.replace(`/movie/${id}`);
                    }
                    found = true;
                }
            })
        }
        if (!found) {
            window.location.replace(`/finnkino/error/${item.ID._text}`);
        }
    }) 
}

function fetchMovieAPI(API, setter) {
    fetch(API)
    .then(res => res.json())
    .then(json => {
        const items = json.results;

        setter(
            <Row>
                <Col lg={2} md={3} xs={4} className="text-center p-2 text-decoration-none text-dark" as={Link} to={`/movie/${items[0].id}`}>
                    <img src={`https://image.tmdb.org/t/p/w500${items[0].poster_path}`} className="img-fluid p-1"/>
                    {items[0].title}
                </Col>
                <Col lg={2} md={3} xs={4} className="text-center p-2 text-decoration-none text-dark" as={Link} to={`/movie/${items[1].id}`}>
                    <img src={`https://image.tmdb.org/t/p/w500${items[1].poster_path}`} className="img-fluid p-1"/>
                    {items[1].title}
                </Col>
                <Col lg={2} md={3} xs={4} className="text-center p-2 text-decoration-none text-dark" as={Link} to={`/movie/${items[2].id}`}>
                    <img src={`https://image.tmdb.org/t/p/w500${items[2].poster_path}`} className="img-fluid p-1"/>
                    {items[2].title}
                </Col>
                <Col lg={2} xs={0} md={3} className="text-center p-2 d-none d-md-block text-decoration-none text-dark" as={Link} to={`/movie/${items[3].id}`}>
                    <img src={`https://image.tmdb.org/t/p/w500${items[3].poster_path}`} className="img-fluid p-1"/>
                    {items[3].title}
                </Col>
                <Col lg={2} xs={0} className="text-center p-2 d-none d-lg-block text-decoration-none text-dark" as={Link} to={`/movie/${items[4].id}`}>
                    <img src={`https://image.tmdb.org/t/p/w500${items[4].poster_path}`} className="img-fluid p-1"/>
                    {items[4].title}
                </Col>
                <Col lg={2} xs={0} className="text-center p-2 d-none d-lg-block text-decoration-none text-dark" as={Link} to={`/movie/${items[5].id}`}>
                    <img src={`https://image.tmdb.org/t/p/w500${items[5].poster_path}`} className="img-fluid p-1"/>
                    {items[5].title}
                </Col>
            </Row>
        )
    })
    .catch(error => {
        console.log(error.message);

        setter(
            <Row className="row-cols-auto">
                <Col>
                    Failed to fetch. Try viewing all or refreshing the page.
                </Col>
            </Row>
        )
    })
}

function fetchShowAPI(API, setter) {
    fetch(API)
    .then(res => res.json())
    .then(json => {
        const items = json.results;

        setter(
            <Row>
                <Col lg={2} md={3} xs={4} className="text-center p-2 text-decoration-none text-dark" as={Link} to={`/tv/${items[0].id}`}>
                    <img src={`https://image.tmdb.org/t/p/w500${items[0].poster_path}`} className="img-fluid p-1"/>
                    {items[0].name}
                </Col>
                <Col lg={2} md={3} xs={4} className="text-center p-2 text-decoration-none text-dark" as={Link} to={`/tv/${items[1].id}`}>
                    <img src={`https://image.tmdb.org/t/p/w500${items[1].poster_path}`} className="img-fluid p-1"/>
                    {items[1].name}
                </Col>
                <Col lg={2} md={3} xs={4} className="text-center p-2 text-decoration-none text-dark" as={Link} to={`/tv/${items[2].id}`}>
                    <img src={`https://image.tmdb.org/t/p/w500${items[2].poster_path}`} className="img-fluid p-1"/>
                    {items[2].name}
                </Col>
                <Col lg={2} xs={0} md={3} className="text-center p-2 d-none d-md-block text-decoration-none text-dark" as={Link} to={`/tv/${items[3].id}`}>
                    <img src={`https://image.tmdb.org/t/p/w500${items[3].poster_path}`} className="img-fluid p-1"/>
                    {items[3].name}
                </Col>
                <Col lg={2} xs={0} className="text-center p-2 d-none d-lg-block text-decoration-none text-dark" as={Link} to={`/tv/${items[4].id}`}>
                    <img src={`https://image.tmdb.org/t/p/w500${items[4].poster_path}`} className="img-fluid p-1"/>
                    {items[4].name}
                </Col>
                <Col lg={2} xs={0} className="text-center p-2 d-none d-lg-block text-decoration-none text-dark" as={Link} to={`/tv/${items[5].id}`}>
                    <img src={`https://image.tmdb.org/t/p/w500${items[5].poster_path}`} className="img-fluid p-1"/>
                    {items[5].name}
                </Col>
            </Row>
        )
    })
    .catch(error => {
        console.log(error.message);

        setter(
            <Row className="row-cols-auto">
                <Col>
                    Failed to fetch. Try viewing all or refreshing the page.
                </Col>
            </Row>
        )
    })
}

function fetchFinKinoEvents(API, setter) {
    fetch(API)
    .then(res => res.text())
    .then(xml => {
        const items = shuffle(JSON.parse(xml2json(xml, {compact: true})).Events.Event);

        setter(
            <Row>
                <Col lg={2} md={3} xs={4} className="text-center p-2 text-decoration-none text-dark" as={Link} onClick={() => {getLink(items[0])}}>
                    <img src={items[0].Images.EventLargeImagePortrait._text} className="img-fluid p-1"/>
                    {items[0].Title._text}
                </Col>
                <Col lg={2} md={3} xs={4} className="text-center p-2 text-decoration-none text-dark" as={Link}  onClick={() => {getLink(items[1])}}>
                    <img src={items[1].Images.EventLargeImagePortrait._text} className="img-fluid p-1"/>
                    {items[1].Title._text}
                </Col>
                <Col lg={2} md={3} xs={4} className="text-center p-2 text-decoration-none text-dark" as={Link}  onClick={() => {getLink(items[2])}}>
                    <img src={items[2].Images.EventLargeImagePortrait._text} className="img-fluid p-1"/>
                    {items[2].Title._text}
                </Col>
                <Col lg={2} xs={0} md={3} className="text-center p-2 d-none d-md-block text-decoration-none text-dark" as={Link}  onClick={() => {getLink(items[3])}}>
                    <img src={items[3].Images.EventLargeImagePortrait._text} className="img-fluid p-1"/>
                    {items[3].Title._text}
                </Col>
                <Col lg={2} xs={0} className="text-center p-2 d-none d-lg-block text-decoration-none text-dark" as={Link}  onClick={() => {getLink(items[4])}}>
                    <img src={items[4].Images.EventLargeImagePortrait._text} className="img-fluid p-1"/>
                    {items[4].Title._text}
                </Col>
                <Col lg={2} xs={0} className="text-center p-2 d-none d-lg-block text-decoration-none text-dark" as={Link}  onClick={() => {getLink(items[5])}}>
                    <img src={items[5].Images.EventLargeImagePortrait._text} className="img-fluid p-1"/>
                    {items[5].Title._text}
                </Col>
            </Row>
        )
    })
}

export { fetchMovieAPI, fetchShowAPI, fetchFinKinoEvents, getLink };