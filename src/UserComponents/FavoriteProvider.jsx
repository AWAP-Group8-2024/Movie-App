import { createContext, useState, useContext } from "react";
import axios from "axios";
import { useUser } from "./UseUser";

const url = process.env.REACT_APP_API_URL;
const FavoriteContext = createContext();

export function FavoriteProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const { user } = useUser();
  const token = user.token;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
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

  // // Add a new favorite
  // const addFavorite = async (accountId, content) => {
  //   try {
  //     const response = await axios.post(`${url}/favorite/`, { headers });
  //     setFavorites((prev) => [...prev, response.data]);
  //   } catch (error) {
  //     console.error("Failed to add favorite:", error);
  //   }
  // };

  // // Remove a favorite
  // const removeFavorite = async (favoriteId) => {
  //   try {
  //     await axios.delete(`/api/favorites/${favoriteId}`);
  //     setFavorites((prev) => prev.filter((item) => item.id !== favoriteId));
  //   } catch (error) {
  //     console.error("Failed to remove favorite:", error);
  //   }
  // };

  // const getFavoritesByType = (type) =>
  //   favorites.filter((favorite) => favorite.media_type === type);

  return (
    <FavoriteContext.Provider
      value={{
        favorites,
        getUserFavorites,
        // addFavorite,
        // removeFavorite,
        // getFavoritesByType,
      }}
    >
      {children}
    </FavoriteContext.Provider>
  );
}

export const useFavorite = () => useContext(FavoriteContext);
