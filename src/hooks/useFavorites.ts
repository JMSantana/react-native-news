import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NewsArticle } from "../services/api";

// Using a namespaced key to avoid conflicts with other apps
const FAVORITES_KEY = "@news_articles_favorites";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load favorites from AsyncStorage on mount
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem(FAVORITES_KEY);
        if (storedFavorites) {
          // Parse the stored favorites and handle potential JSON errors
          try {
            const parsed = JSON.parse(storedFavorites);
            setFavorites(parsed);
          } catch (e) {
            console.error("Failed to parse stored favorites:", e);
            // If we can't parse the stored data, start fresh
            setFavorites([]);
          }
        }
      } catch (error) {
        // Log the error but don't crash the app
        console.error("Error loading favorites:", error);
        setFavorites([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();
  }, []);

  // Save favorites to AsyncStorage whenever they change
  const saveFavorites = useCallback(async (newFavorites: NewsArticle[]) => {
    try {
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
      setFavorites(newFavorites);
    } catch (error) {
      // If storage fails, at least keep the state in memory
      console.error("Failed to save favorites:", error);
      setFavorites(newFavorites);
    }
  }, []);

  // Toggle favorite status - using title as ID since API doesn't provide unique IDs
  // TODO: Update this when API provides proper IDs
  const toggleFavorite = useCallback(
    (article: NewsArticle) => {
      const isFavorite = favorites.some((fav) => fav.title === article.title);
      const newFavorites = isFavorite
        ? favorites.filter((fav) => fav.title !== article.title)
        : [...favorites, article];
      saveFavorites(newFavorites);
    },
    [favorites, saveFavorites]
  );

  // Check if an article is favorited
  const isFavorite = useCallback(
    (article: NewsArticle) => {
      return favorites.some((fav) => fav.title === article.title);
    },
    [favorites]
  );

  return {
    favorites,
    isLoading,
    toggleFavorite,
    isFavorite,
  };
};
