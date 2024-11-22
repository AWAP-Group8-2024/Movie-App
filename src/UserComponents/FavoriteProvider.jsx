import { createContext, useState, useContext } from "react";
import axios from "axios";
import { useUser } from "./UseUser";
import { getUserFromSession } from "../components/utils.js";

const url = process.env.REACT_APP_API_URL;

const FavoriteContext = createContext();

export function FavoriteProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [contentInFavorite, setContentInFavorite] = useState(false);
  const { user } = useUser();
  const token = user.token;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const checkContentById = async (content) => {
    if (!token) return false;

    try {
      const body = { content_id: content.id };
      const response = await axios.post(`${url}/favorite/check`, body, {
        headers,
      });

      return response.data.favorite;
    } catch (error) {
      console.error("Error checking favorite status:", error);
    }
  };

  const getUserFavorites = async () => {
    try {
      const response = await axios.get(`${url}/favorite/`, { headers });
      setFavorites(response.data);
    } catch (error) {
      console.error("Failed to fetch favorites:", error);
      throw error;
    }
  };

  const addToFavorite = async (content, mediaType) => {
    try {
      const user = getUserFromSession();
      if (user.token === "") {
        alert("Please log in to add content to your favorites.");
        return false;
      }
      const token = user.token;
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const title = mediaType === "movie" ? content.title : content.name;
      const body = {
        content_id: content.id,
        title: title,
        media_type: mediaType,
        poster_path: content.poster_path,
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

  const removeFromFavorite = async (content) => {
    try {
      const user = getUserFromSession();
      if (user.token === "") {
        alert("Please log in to remove content from your favorites.");
        return false;
      }
      const token = user.token;
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      const body = { content_id: content.id };
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

  return (
    <FavoriteContext.Provider
      value={{
        favorites,
        getUserFavorites,
        checkContentById,
        contentInFavorite,
        setContentInFavorite,
        addToFavorite,
        removeFromFavorite,
      }}
    >
      {children}
    </FavoriteContext.Provider>
  );
}

export const useFavorite = () => useContext(FavoriteContext);
