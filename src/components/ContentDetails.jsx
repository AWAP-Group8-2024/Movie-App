import { useParams } from "react-router-dom";
import MovieDetails from "./MovieDetails";
import TVShowDetails from "./TVShowDetails";

export default function ContentDetails() {
  const { mediaType } = useParams();

  if (mediaType === "movie") {
    return <MovieDetails />;
  } else if (mediaType === "tv") {
    return <TVShowDetails />;
  } else {
    return <div>Invalid media type</div>;
  }
}
