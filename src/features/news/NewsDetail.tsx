import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  Pressable,
} from "react-native";
import { NewsArticle } from "../../services/api";
import { WebView } from "react-native-webview";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

interface NewsDetailProps {
  article: NewsArticle;
}

export const NewsDetail: React.FC<NewsDetailProps> = ({ article }) => {
  // This is the width of the screen, we'll use it to set the width of the thumbnail
  const { width } = Dimensions.get("window");
  const router = useRouter();

  const handleBack = () => {
    // We're using push instead of replace to allow the user to go back to the previous screen
    router.push("/");
  };

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: article.thumbnail }}
        style={[styles.thumbnail, { width }]}
        resizeMode="cover"
        testID="article-image"
      />
      <View style={styles.content}>
        <Pressable
          style={styles.breadcrumb}
          onPress={handleBack}
          accessibilityRole="button"
          accessibilityLabel="Go back to news list"
          testID="back-button"
        >
          <Ionicons name="chevron-back" size={20} color="#007AFF" />
          <Text style={styles.breadcrumbText}>Back to News</Text>
        </Pressable>

        <Text style={styles.title}>{article.title}</Text>
        <Text style={styles.competition}>{article.competition}</Text>
        <Text style={styles.date}>
          {new Date(article.date).toLocaleDateString()}
        </Text>

        {article.videos.map((video, index) => (
          <View key={index} style={styles.videoContainer}>
            <Text style={styles.videoTitle}>{video.title}</Text>
            <WebView
              source={{ html: video.embed }}
              style={styles.video}
              scrollEnabled={false}
              allowsFullscreenVideo
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  thumbnail: {
    height: 250,
  },
  content: {
    padding: 16,
  },
  breadcrumb: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingVertical: 8,
  },
  breadcrumbText: {
    color: "#007AFF",
    fontSize: 16,
    marginLeft: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  competition: {
    fontSize: 18,
    color: "#666",
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: "#999",
    marginBottom: 16,
  },
  videoContainer: {
    marginVertical: 16,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#f5f5f5",
  },
  video: {
    height: 220,
    width: "100%",
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
});
