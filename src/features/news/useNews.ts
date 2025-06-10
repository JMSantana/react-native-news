import { useQuery } from "@tanstack/react-query";
import { fetchNews, NewsArticle } from "../../services/api";

export const useNews = () => {
  return useQuery<NewsArticle[], Error>({
    queryKey: ["news"],
    queryFn: async () => {
      const data = await fetchNews();

      if (!data || data.length === 0) {
        throw new Error("No news data available");
      }
      return data;
    },
    staleTime: 10 * 60 * 1000, // Consider data refresh after 10 minutes
    retry: 3,
    // Retry delay is the time to wait before retrying the request.
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
