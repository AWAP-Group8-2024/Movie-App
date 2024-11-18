import axios from "axios";
const url = process.env.REACT_APP_API_URL;

const getUserFromSession = () => {
  const userFromSessionStorage = sessionStorage.getItem("user");
  return userFromSessionStorage
    ? JSON.parse(userFromSessionStorage)
    : { id: "", email: "", token: "" };
};

export const addToFavorite = async (movie) => {
  try {
    const user = getUserFromSession();
    const token = user.token;

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    const contentBody = {
      imdb_id: movie.imdb_id,
      title: movie.title,
      media_type: "movie",
      poster_path: movie.poster_path,
    };

    const response = await axios.post(
      `${url}/favorite/addFavorite`,
      contentBody,
      { headers }
    );

    if (response.status === 200) {
      alert("Movie added to favorites!");
    }
  } catch (error) {
    console.error("Error adding to favorites:", error);
    alert("Failed to add movie to favorites");
  }
};
