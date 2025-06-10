import { useQuery } from "@tanstack/react-query";
import { fetchNews, NewsArticle } from "../../services/api";

// Since the API doesn't support pagination, we'll handle it client-side
// This might need to be updated if the API adds pagination support
const ITEMS_PER_PAGE = 20;

export const useNews = (page: number = 1) => {
  // Fetch all data once since the API doesn't support pagination
  const {
    data: allData,
    isLoading,
    error,
    refetch,
  } = useQuery<NewsArticle[], Error>({
    queryKey: ["news"],
    queryFn: async () => {
      const data = await fetchNews();

      // Handle empty data case
      if (!data || data.length === 0) {
        throw new Error(
          "No news available at the moment. Please try again later."
        );
      }

      return data;
    },
    // News doesn't change very frequently, so we can cache it for a while
    staleTime: 10 * 60 * 1000, // 10 minutes
    // Retry failed requests with exponential backoff
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Calculate client-side paginated data
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
