import { useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import List from "./List";

export default function ListCategories() {
  const { condition } = useParams();
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search);
  const [body, setBody] = useState(null);

  const page = +searchQuery.get("page");

  function getItems() {
    fetch(
      `https://api.themoviedb.org/3/${condition.replaceAll("_", "/")}?api_key=${
        process.env.REACT_APP_TMDB_API_KEY
      }&language=en-US&page=${page}`
    )
      .then((res) => res.json())
      .then((json) => {
        setBody(
          <List
            items={json.results || []}
            total_pages={json.total_pages || -1}
          />
        );
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  useEffect(getItems, []);

  return <div>{body}</div>;
}
