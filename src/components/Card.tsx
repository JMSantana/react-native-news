import React from "react";
import { StyleSheet, View, Image, Text, Pressable } from "react-native";
import { NewsArticle } from "../services/api";

interface CardProps {
  article: NewsArticle;
  onPress: (article: NewsArticle) => void;
  isFavorite?: boolean;
  onFavoritePress?: () => void;
}

export const Card: React.FC<CardProps> = ({
  article,
  onPress,
  isFavorite = false,
  onFavoritePress,
}) => {
  return (
    <Pressable
      style={styles.container}
      onPress={() => onPress(article)}
      accessibilityRole="button"
      accessibilityLabel={`${article.title} from ${article.competition}`}
      accessibilityHint="Double tap to view article details"
    >
      <Image
        source={{ uri: article.thumbnail }}
        style={styles.thumbnail}
        accessibilityLabel={`Thumbnail for ${article.title}`}
      />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {article.title}
        </Text>
        <Text style={styles.competition}>{article.competition}</Text>
        {onFavoritePress && (
          <Pressable
            onPress={onFavoritePress}
            style={styles.favoriteButton}
            accessibilityRole="button"
            accessibilityLabel={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
            accessibilityHint="Double tap to toggle favorite status"
          >
            <Text style={styles.favoriteIcon}>{isFavorite ? "★" : "☆"}</Text>
          </Pressable>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  thumbnail: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  competition: {
    fontSize: 14,
    color: "#666",
  },
  favoriteButton: {
    position: "absolute",
    top: 16,
    right: 16,
  },
  favoriteIcon: {
    fontSize: 24,
    color: "#FFD700",
  },
});
