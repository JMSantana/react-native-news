import { NewsArticle } from "../services/api";

export type RootStackParamList = {
  NewsList: undefined;
  NewsDetail: { article: NewsArticle };
  Favorites: undefined;
};
