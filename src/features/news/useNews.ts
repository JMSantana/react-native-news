import { useQuery } from "@tanstack/react-query";
import { fetchNews, NewsArticle } from "../../services/api";

const ITEMS_PER_PAGE = 20;

export const useNews = (page: number = 1) => {
  // Fetch all data once since the API does not support pagination
  const {
    data: allData,
    isLoading,
    error,
    refetch,
  } = useQuery<NewsArticle[], Error>({
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

  // Calculate client side paginated data
  const paginatedData = allData ? allData.slice(0, page * ITEMS_PER_PAGE) : [];
  const hasMore = allData ? page * ITEMS_PER_PAGE < allData.length : false;

  return {
    data: paginatedData,
    isLoading,
    error,
    refetch,
    hasMore,
  };
};
