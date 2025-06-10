import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NewsArticle } from "../services/api";

const FAVORITES_KEY = "@news_articles_favorites";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load favorites from AsyncStorage
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem(FAVORITES_KEY);
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }
      } catch (error) {
        console.error("Error loading favorites from AsyncStorage:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();
  }, []);

  // Save favorites to AsyncStorage
  const saveFavorites = useCallback(async (newFavorites: NewsArticle[]) => {
    try {
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
      setFavorites(newFavorites);
    } catch (error) {
      console.error("Error saving favorites to AsyncStorage:", error);
    }
  }, []);

  // Toggle favorite status
  const toggleFavorite = useCallback(
    (article: NewsArticle) => {
      const isFavorite = favorites.some((fav) => fav.title === article.title);
      // Since articles don't have ids, we're using the title to check if it's already in the favorites
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
