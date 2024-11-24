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
    arr[i] = storage;
  }
  return arr;
}

async function getLink(item) {
  fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&query=${item.OriginalTitle._text}&page=1`
  )
    .then((res) => res.json())
    .then((json) => {
      let found = false;
      if (json.results.length > 0) {
        json.results.forEach((element) => {
          if (
            element.release_date.replaceAll(/[-].+/g, "") ===
            item.ProductionYear._text
          ) {
            const id = element.id;
            if (!found) {
              window.location.replace(`/movie/${id}`);
            }
            found = true;
          }
        });
      }
      if (!found) {
        window.location.replace(`/finnkino/error/${item.ID._text}`);
      }
    });
}

function fetchMovieAPI(API, setter) {
  fetch(API)
    .then((res) => res.json())
    .then((json) => {
      const items = json.results;
      const firstSixItems = items.slice(0, 6);

      setter(
        <Row>
          {firstSixItems.map((item) => (
            <Col
              lg={2}
              md={3}
              xs={4}
              className="text-center p-2 text-decoration-none text-dark"
              as={Link}
              to={`/movie/${item.id}`}
              key={item.id}
            >
              <img
                src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                className="img-fluid p-1"
                alt={`${item.title}`}
              />
              {item.title}
            </Col>
          ))}
        </Row>
      );
    })
    .catch((error) => {
      console.log(error.message);

      setter(
        <Row className="row-cols-auto">
          <Col>Failed to fetch. Try viewing all or refreshing the page.</Col>
        </Row>
      );
    });
}

function fetchShowAPI(API, setter) {
  fetch(API)
    .then((res) => res.json())
    .then((json) => {
      const items = json.results;
      const firstSixItems = items.slice(0, 6);

      setter(
        <Row>
          {firstSixItems.map((item) => (
            <Col
              lg={2}
              md={3}
              xs={4}
              className="text-center p-2 text-decoration-none text-dark"
              as={Link}
              to={`/tv/${item.id}`}
              key={item.id}
            >
              <img
                src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                className="img-fluid p-1"
                alt={`${item.title}`}
              />
              {item.title}
            </Col>
          ))}
        </Row>
      );
    })
    .catch((error) => {
      console.log(error.message);

      setter(
        <Row className="row-cols-auto">
          <Col>Failed to fetch. Try viewing all or refreshing the page.</Col>
        </Row>
      );
    });
}

function fetchFinKinoEvents(API, setter) {
  fetch(API)
    .then((res) => res.text())
    .then((xml) => {
      const items = shuffle(
        JSON.parse(xml2json(xml, { compact: true })).Events.Event
      );
      const firstSixItems = items.slice(0, 6);
      setter(
        <Row>
          {firstSixItems.map((item) => (
            <Col
              lg={2}
              md={3}
              xs={4}
              className="text-center p-2 text-decoration-none text-dark"
              as={Link}
              key={item.ID._text}
              onClick={() => {
                getLink(item);
              }}
            >
              <img
                src={`${item.Images.EventLargeImagePortrait._text}`}
                className="img-fluid p-1"
                alt={`${item.title}`}
              />
              {item.Title._text}
            </Col>
          ))}
        </Row>
      );
    });
}

export { fetchMovieAPI, fetchShowAPI, fetchFinKinoEvents, getLink };
