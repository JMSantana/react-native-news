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

  const handleFavoritePress = (article: NewsArticle) => {
    toggleFavorite(article);
    Toast.show({
      type: isFavorite(article) ? "info" : "success",
      text1: isFavorite(article)
        ? "Removed from favorites"
        : "Added to favorites",
      position: "bottom",
      visibilityTime: 2000,
    });
  };

  const handleArticlePress = (article: NewsArticle) => {
    router.push({
      pathname: "/news/[id]",
      params: {
        id: article.title,
        article: JSON.stringify(article),
      },
    });
  };

  const handleLoadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      setPage((prev) => prev + 1);
    }
  }, [isLoading, hasMore]);

  const handleRefresh = useCallback(() => {
    setPage(1);
    refetch();
  }, [refetch]);

  if (isLoading && !data && page === 1) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading news...</Text>
      </View>
    );
  }

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
      onEndReachedThreshold={0.5}
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
