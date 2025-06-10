import React, { createContext, useContext } from "react";
import { useFavorites } from "../../hooks/useFavorites";
import { NewsArticle } from "../../services/api";

interface FavoritesContextType {
  favorites: NewsArticle[];
  isLoading: boolean;
  toggleFavorite: (article: NewsArticle) => void;
  isFavorite: (article: NewsArticle) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const favoritesState = useFavorites();

  return (
    <FavoritesContext.Provider value={favoritesState}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavoritesContext = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error(
      "useFavoritesContext must be used within a FavoritesProvider"
    );
  }
  return context;
};
