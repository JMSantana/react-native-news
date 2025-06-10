import React, { useState, useCallback } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  Text,
  Pressable,
} from "react-native";
import { useNews } from "./useNews";
import { Card } from "../../components/Card";
import { NewsArticle } from "../../services/api";
import { useRouter } from "expo-router";
import { useFavoritesContext } from "../favorites/favorites.context";
import Toast from "react-native-toast-message";

export const NewsList: React.FC = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const { data, isLoading, error, refetch, hasMore } = useNews(page);
  const { toggleFavorite, isFavorite } = useFavoritesContext();

  // Handle favorite toggle with visual feedback
  const handleFavoritePress = (article: NewsArticle) => {
    toggleFavorite(article);
    // Show a toast message to confirm the action
    Toast.show({
      type: isFavorite(article) ? "info" : "success",
      text1: isFavorite(article)
        ? "Removed from favorites"
        : "Added to favorites",
      position: "bottom",
      visibilityTime: 2000, // 2 seconds should be enough for users to notice
    });
  };

  // Navigate to article details
  const handleArticlePress = (article: NewsArticle) => {
    // We're passing the full article as a param to avoid another API call
    // This might need to be optimized if articles get too large
    router.push({
      pathname: "/news/[id]",
      params: {
        id: article.title,
        article: JSON.stringify(article),
      },
    });
  };

  // Load more articles when reaching the end of the list
  const handleLoadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      setPage((prev) => prev + 1);
    }
  }, [isLoading, hasMore]);

  // Reset pagination and refetch data
  const handleRefresh = useCallback(() => {
    setPage(1);
    refetch();
  }, [refetch]);

  // Show loading state only on initial load
  if (isLoading && !data && page === 1) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading news...</Text>
      </View>
    );
  }

  // Show error state with retry option
  if (error && page === 1) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>
          {error.message ||
            "Error loading news. Please try again by refreshing the page or clicking the retry button."}
        </Text>
        <Pressable
          style={styles.retryButton}
          onPress={handleRefresh}
          accessibilityRole="button"
          accessibilityLabel="Retry loading news"
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      renderItem={({ item }) => (
        <Card
          article={item}
          onPress={handleArticlePress}
          isFavorite={isFavorite(item)}
          onFavoritePress={() => handleFavoritePress(item)}
        />
      )}
      keyExtractor={(item) => item.title}
      refreshControl={
        <RefreshControl
          refreshing={isLoading && page === 1}
          onRefresh={handleRefresh}
        />
      }
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5} // Start loading more when user is halfway through the list
      contentContainerStyle={styles.listContent}
      ListEmptyComponent={
        <View style={styles.centered}>
          <Text style={styles.emptyText}>There are no news available</Text>
        </View>
      }
      ListFooterComponent={
        isLoading && page > 1 ? (
          <View style={styles.footerLoader}>
            <ActivityIndicator size="small" />
            <Text style={styles.loadingText}>Loading more...</Text>
          </View>
        ) : null
      }
    />
  );
};

// Styles are kept simple and focused on functionality
// TODO: Consider moving to a theme file if we add dark mode
const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  listContent: {
    paddingVertical: 8,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 16,
  },
  emptyText: {
    color: "#666",
    textAlign: "center",
    margin: 16,
  },
  loadingText: {
    marginTop: 8,
    color: "#666",
  },
  retryButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: "center",
  },
});
