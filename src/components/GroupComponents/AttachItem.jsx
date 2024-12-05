import { useEffect, useState } from "react";
import { Modal, Button, Col, Row } from "react-bootstrap";
import { useFavorite } from "../../UserComponents/FavoriteProvider";

export default function AttachItem({ chosenMovie, setChosenMovie }) {
    const [show, setShow] = useState(false);
    const { getUserFavorites } = useFavorite();
    const [favorites, setFavorites] = useState([]);

    function getFavorites() {
        getUserFavorites(JSON.parse(sessionStorage.getItem('user')).id)
        .then(res => {
            setFavorites(res)
        })
    }

    useEffect(getFavorites ,[]);

    return (
        <>
        <Button variant="dark" className="btn-sm mb-3" onClick={() => setShow(true)}>
            Attach movie
        </Button>

        <Modal
            show={show}
            onHide={() => setShow(false)}
            size="lg"
            aria-labelledby="ChoosingItem"
        >
            <Modal.Header closeButton>
            <Modal.Title id="ChoosingItem">
                Choose movie or tv show from your favorites
            </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row >
                    {favorites.map((element, i) => (
                        <Col
                            key={i}
                            xs={6}
                            md={4}
                            lg={3}
                            className="text-center"
                            onClick={() => {
                                setChosenMovie(element);
                                setShow(false);
                            }}
                        >
                            <img
                                src={`https://image.tmdb.org/t/p/w500${element.poster_path}`}
                                className="img-fluid rounded"
                            />
                            {element.title}
                        </Col>
                    ))}
                    {favorites.length === 0 ?
                    <Col
                        className="text-center"
                    >
                        You have no movies in your favorite list.
                        You can find something you enjoy <a href="/list/movie_popular?page=1">here</a>
                    </Col> :
                    null}
                </Row>
            </Modal.Body>
            {chosenMovie ?
            (
                <Modal.Footer>
                    <Button
                        variant="danger"
                        onClick={() => {
                            setChosenMovie(null);
                            setShow(false)
                        }}
                    >Cancel selection</Button>
                </Modal.Footer>
            ) :
            null}
        </Modal>

        <div className="mb-3">
            {chosenMovie ?
            `Attached movie: "${chosenMovie.title}"` :
            ''}
        </div>
        </>
    );
}