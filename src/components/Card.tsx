import React from "react";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { NewsArticle } from "../services/api";
import { Ionicons } from "@expo/vector-icons";

interface CardProps {
  article: NewsArticle;
  // Making onPress optional to handle the case where the card is not clickable for web
  onPress?: (article: NewsArticle) => void;
  isFavorite: boolean;
  onFavoritePress: (article: NewsArticle) => void;
}

export const Card: React.FC<CardProps> = ({
  article,
  onPress,
  isFavorite,
  onFavoritePress,
}) => {
  return (
    <Pressable
      style={[styles.container, !onPress && styles.nonClickable]}
      onPress={() => onPress?.(article)}
      accessibilityRole={onPress ? "button" : "none"}
      accessibilityLabel={
        onPress ? `Read article: ${article.title}` : undefined
      }
      disabled={!onPress}
      testID="card-pressable"
    >
      {article.thumbnail && (
        <Image
          source={{ uri: article.thumbnail }}
          style={styles.image}
          accessibilityLabel={`Thumbnail for article: ${article.title}`}
        />
      )}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {article.title}
        </Text>
        <Text style={styles.competition} numberOfLines={2}>
          {article.competition}
        </Text>
        <View style={styles.footer}>
          <Text style={styles.date}>
            {new Date(article.date).toLocaleDateString()}
          </Text>
          <Pressable
            onPress={() => onFavoritePress(article)}
            style={styles.favoriteButton}
            accessibilityRole="button"
            accessibilityLabel={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
            testID="favorite-button"
          >
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={24}
              color={isFavorite ? "#FF3B30" : "#000000"}
            />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  nonClickable: {
    opacity: 1,
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#000000",
  },
  competition: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 12,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  date: {
    fontSize: 12,
    color: "#666666",
  },
  favoriteButton: {
    padding: 4,
  },
});
