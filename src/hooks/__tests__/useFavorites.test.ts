import { renderHook, act } from "@testing-library/react-hooks";
import { useFavorites } from "../useFavorites";
import AsyncStorage from "@react-native-async-storage/async-storage";

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

const mockArticle = {
  title: "Test Article",
  description: "Test Description",
  url: "https://test.com",
  thumbnail: "https://test.com/image.jpg",
  date: "2024-03-20",
  competition: "Test Competition",
  competitionUrl: "https://test.com/competition",
  matchviewUrl: "https://test.com/match",
  videos: [],
};

describe("useFavorites", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock AsyncStorage.getItem to return empty array by default
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
  });

  it("should initialize with empty favorites", async () => {
    const { result } = renderHook(() => useFavorites());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.favorites).toEqual([]);
  });

  it("should load existing favorites from storage", async () => {
    const existingFavorites = [mockArticle];
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify(existingFavorites)
    );

    const { result } = renderHook(() => useFavorites());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.favorites).toEqual(existingFavorites);
  });

  it("should add an article to favorites", async () => {
    const { result } = renderHook(() => useFavorites());

    await act(async () => {
      result.current.toggleFavorite(mockArticle);
    });

    expect(result.current.favorites).toContainEqual(mockArticle);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      "@news_articles_favorites",
      JSON.stringify([mockArticle])
    );
  });

  it("should remove an article from favorites", async () => {
    const existingFavorites = [mockArticle];
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify(existingFavorites)
    );

    const { result } = renderHook(() => useFavorites());

    // Wait for initial load
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    await act(async () => {
      result.current.toggleFavorite(mockArticle);
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.favorites).not.toContainEqual(mockArticle);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      "@news_articles_favorites",
      JSON.stringify([])
    );
  });

  it("should check if an article is favorited", async () => {
    const existingFavorites = [mockArticle];
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify(existingFavorites)
    );

    const { result } = renderHook(() => useFavorites());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.isFavorite(mockArticle)).toBe(true);
    expect(
      result.current.isFavorite({ ...mockArticle, title: "Different" })
    ).toBe(false);
  });
});
