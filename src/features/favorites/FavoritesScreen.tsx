import React from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  ActivityIndicator,
} from "react-native";
import { Card } from "../../components/Card";
import { useFavoritesContext } from "./favorites.context";

export const FavoritesScreen: React.FC = () => {
  const { favorites, isLoading, toggleFavorite, isFavorite } =
    useFavoritesContext();

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <FlatList
      data={favorites}
      renderItem={({ item }) => (
        <Card
          article={item}
          isFavorite={isFavorite(item)}
          onFavoritePress={() => toggleFavorite(item)}
        />
      )}
      keyExtractor={(item) => item.title}
      contentContainerStyle={styles.listContent}
      ListEmptyComponent={
        <View style={styles.centered}>
          <Text style={styles.emptyText}>
            No saved favorites. Please, add some articles to your favorites.
          </Text>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    paddingVertical: 8,
  },
  emptyText: {
    color: "#666",
    textAlign: "center",
    margin: 16,
  },
});
