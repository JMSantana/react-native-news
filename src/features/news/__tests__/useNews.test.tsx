import React from "react";
import { renderHook, waitFor } from "@testing-library/react-native";
import { useNews } from "../useNews";
import { fetchNews } from "../../../services/api";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

jest.mock("../../../services/api", () => ({
  fetchNews: jest.fn(),
}));

const mockArticles = [
  {
    title: "Test Article 1",
    description: "Test Description 1",
    url: "https://test.com/1",
    thumbnail: "https://test.com/image1.jpg",
    date: "2024-03-20",
    competition: "Test Competition 1",
    competitionUrl: "https://test.com/competition1",
    matchviewUrl: "https://test.com/match1",
    videos: [],
  },
  {
    title: "Test Article 2",
    description: "Test Description 2",
    url: "https://test.com/2",
    thumbnail: "https://test.com/image2.jpg",
    date: "2024-03-21",
    competition: "Test Competition 2",
    competitionUrl: "https://test.com/competition2",
    matchviewUrl: "https://test.com/match2",
    videos: [],
  },
];

// Create a new QueryClient for each test to ensure that the query is not cached
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        refetchOnWindowFocus: false,
      },
    },
  });

const wrapper = ({ children }: { children: React.ReactNode }) => {
  const testQueryClient = createTestQueryClient();
  return (
    <QueryClientProvider client={testQueryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe("useNews", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should fetch articles successfully", async () => {
    (fetchNews as jest.Mock).mockResolvedValueOnce(mockArticles);

    const { result } = renderHook(() => useNews(), {
      wrapper,
    });

    expect(result.current.isLoading).toBe(true);

    jest.runAllTimers();

    await waitFor(
      () => {
        expect(result.current.isLoading).toBe(false);
      },
      { timeout: 10000 }
    );

    expect(result.current.data).toEqual(mockArticles);
    expect(result.current.error).toBeNull();
  });

  it("should handle empty data response", async () => {
    (fetchNews as jest.Mock).mockResolvedValueOnce([]);

    const { result } = renderHook(() => useNews(), {
      wrapper,
    });

    jest.runAllTimers();

    await waitFor(
      () => {
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBeInstanceOf(Error);
      },
      { timeout: 10000 }
    );

    expect(result.current.error?.message).toBe("No news data available");
  });

  it("should handle fetch error", async () => {
    const error = new Error("Failed to fetch");
    (fetchNews as jest.Mock).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useNews(), {
      wrapper,
    });

    jest.runAllTimers();

    await waitFor(
      () => {
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBeInstanceOf(Error);
      },
      { timeout: 10000 }
    );

    expect(result.current.error?.message).toBe("No news data available");
    expect(result.current.data).toEqual([]);
  });

  it("should retry failed requests", async () => {
    const error = new Error("Failed to fetch");
    (fetchNews as jest.Mock)
      .mockRejectedValueOnce(error)
      .mockRejectedValueOnce(error)
      .mockResolvedValueOnce(mockArticles);

    const retryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: 3,
          gcTime: 0,
          refetchOnWindowFocus: false,
        },
      },
    });

    const retryWrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={retryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useNews(), {
      wrapper: retryWrapper,
    });

    jest.runAllTimers();

    await waitFor(
      () => {
        expect(result.current.isLoading).toBe(false);
        expect(result.current.data).toEqual(mockArticles);
      },
      { timeout: 10000 }
    );

    expect(fetchNews).toHaveBeenCalledTimes(3);
  });
});
