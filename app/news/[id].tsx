import { useLocalSearchParams } from "expo-router";
import { NewsDetail } from "../../src/features/news/NewsDetail";
import { NewsArticle } from "../../src/services/api";

export default function NewsDetailScreen() {
  const { article } = useLocalSearchParams<{ article: string }>();
  const parsedArticle: NewsArticle = JSON.parse(article);

  return <NewsDetail article={parsedArticle} />;
}
