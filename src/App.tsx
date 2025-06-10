import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { FavoritesProvider } from "./features/favorites/favorites.context";

export default function App() {
  return (
    <SafeAreaProvider>
      <FavoritesProvider>{null}</FavoritesProvider>
    </SafeAreaProvider>
  );
}
