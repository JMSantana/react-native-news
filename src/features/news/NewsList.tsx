import React from "react";
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

export const NewsList: React.FC = () => {
  const router = useRouter();
  const { data, isLoading, error, refetch } = useNews();

  const handleArticlePress = (article: NewsArticle) => {
    router.push({
      pathname: "/news/[id]",
      params: {
        id: article.title,
        article: JSON.stringify(article),
      },
    });
  };

  if (isLoading && !data) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading news...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>
          {error.message ||
            "Error loading news. Please try again by refreshing the page or clicking the retry button."}
        </Text>
        <Pressable
          style={styles.retryButton}
          onPress={() => refetch()}
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
          onFavoritePress={() => {}}
        />
      )}
      keyExtractor={(item) => item.title}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={refetch} />
      }
      contentContainerStyle={styles.listContent}
      ListEmptyComponent={
        <View style={styles.centered}>
          <Text style={styles.emptyText}>There are no news available</Text>
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
});
