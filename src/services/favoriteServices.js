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
    if (user.token === "") {
      alert("Please log in to add movies to your favorites.");
      return;
    }
    const token = user.token;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    const body = {
      imdb_id: movie.imdb_id,
      title: movie.title,
      media_type: "movie",
      poster_path: movie.poster_path,
    };

    const response = await axios.post(`${url}/favorite/add`, body, {
      headers,
    });

    if (response.status === 200) {
      return true;
    }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      alert("You need to log in to perform this action.");
    } else if (error.response && error.response.status === 403) {
      alert("Your session is invalid. Please log in again.");
    } else {
      alert("An unexpected error occurred. Please try again later.");
    }
    console.error("Error adding to favorites:", error);
  }
};

export const checkContentById = async (movie) => {
  try {
    const user = getUserFromSession();
    if (!user.token) return false;
    const token = user.token;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    const body = {
      imdb_id: movie.imdb_id,
    };

    const response = await axios.post(`${url}/favorite/check`, body, {
      headers,
    });
    return response.data.favorite;
  } catch (error) {
    console.error("Error checking favorite status:", error);
  }
};

export const removeFromFavorite = async (movie) => {
  try {
    const user = getUserFromSession();
    if (!user.token) return false;
    const token = user.token;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    const body = {
      imdb_id: movie.imdb_id,
    };
    const response = await axios.delete(`${url}/favorite/delete`, {
      headers,
      data: body,
    });
    if (response.status !== 200) {
      throw new Error("Failed to remove favorite");
    }
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      alert("You need to log in to perform this action.");
    } else if (error.response && error.response.status === 403) {
      alert("Your session is invalid. Please log in again.");
    } else {
      alert("An unexpected error occurred. Please try again later.");
    }
    console.error("Error removing from favorites:", error);
  }
};
