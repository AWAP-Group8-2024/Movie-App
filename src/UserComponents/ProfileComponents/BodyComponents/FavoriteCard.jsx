import {
  Card,
  Row,
  Col,
  CardText,
  Container,
  Carousel,
  CardFooter,
} from "react-bootstrap";
import { useEffect, useState } from "react";
import { useFavorite } from "../../FavoriteProvider";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const FavoriteCard = () => {
  const { favorites } = useFavorite();
  const [contentDetailsFromAPI, setContentDetailsFromAPI] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchContentDetails = async (content_id, media_type) => {
    const apiKey = process.env.REACT_APP_API_KEY;
    const url =
      media_type === "movie"
        ? `https://api.themoviedb.org/3/movie/${content_id}?api_key=${apiKey}&language=en-US`
        : `https://api.themoviedb.org/3/tv/${content_id}?api_key=${apiKey}&language=en-US`;

    try {
      const response = await axios.get(url);
      return { ...response.data, media_type };
    } catch (error) {
      console.error(
        `Failed to fetch details for ${media_type} ID ${content_id}:`,
        error
      );
      return null;
    }
  };

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const details = await Promise.all(
          favorites.map((favorite) =>
            fetchContentDetails(favorite.content_id, favorite.media_type)
          )
        );
        setContentDetailsFromAPI(details.filter((detail) => detail !== null));
      } catch (error) {
        console.error("Error fetching favorites:", error);
      } finally {
        setLoading(false);
      }
    };

    if (favorites.length > 0) {
      fetchFavorites();
    } else {
      setLoading(false);
    }
  }, [favorites]);

  if (loading) {
    return <Row>Loading favorites...</Row>;
  }

  if (contentDetailsFromAPI.length === 0) {
    return <Row>No favorites found.</Row>;
  }

  const handleCardClick = (mediaType, contentId) => {
    navigate(`/${mediaType}/${contentId}`);
  };

  return (
    <Container>
      <div
        className="d-flex overflow-auto"
        style={{
          whiteSpace: "nowrap",
          gap: "2rem",
          padding: "1rem",
          maxWidth: "100%",
        }}
      >
        {contentDetailsFromAPI.map((contentFromAPI, index) => (
          <Card
            key={index}
            className="d-inline-block"
            style={{
              cursor: "pointer",
              minWidth: "150px",
              maxWidth: "200px",
            }}
            onClick={() =>
              handleCardClick(contentFromAPI.media_type, contentFromAPI.id)
            }
          >
            <Card.Body>
              <Card.Img
                variant="top"
                src={`https://image.tmdb.org/t/p/w500${contentFromAPI.poster_path}`}
                alt={contentFromAPI.title || contentFromAPI.name}
                style={{
                  width: "100%",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />
            </Card.Body>
            <CardFooter>
              <CardText className="text-center fs-6 text-truncate">
                {contentFromAPI.title || contentFromAPI.name}
              </CardText>
            </CardFooter>
          </Card>
        ))}
      </div>
    </Container>
  );
};
