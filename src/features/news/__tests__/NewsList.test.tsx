import React from "react";
import { render, fireEvent, act } from "@testing-library/react-native";
import { NewsList } from "../NewsList";
import { useNews } from "../useNews";
import { mockArticles } from "../../../test-utils/mockData";
import "../../../test-utils/mocks";

const mockRouter = {
  push: jest.fn(),
};

const mockFavoritesContext = {
  toggleFavorite: jest.fn(),
  isFavorite: jest.fn(),
};

jest.mock("../useNews");
jest.mock("expo-router", () => ({
  useRouter: jest.fn(() => mockRouter),
}));
jest.mock("../../favorites/favorites.context", () => ({
  useFavoritesContext: jest.fn(() => mockFavoritesContext),
}));

describe("NewsList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows loading state when data is being fetched", () => {
    (useNews as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
      refetch: jest.fn(),
    });

    const { getByText } = render(<NewsList />);
    expect(getByText("Loading news...")).toBeTruthy();
  });

  it("shows error state when there is an error", () => {
    const errorMessage = "Failed to load news";
    (useNews as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error(errorMessage),
      refetch: jest.fn(),
    });

    const { getByText } = render(<NewsList />);
    expect(getByText(errorMessage)).toBeTruthy();
  });

  it("renders list of articles when data is loaded", () => {
    (useNews as jest.Mock).mockReturnValue({
      data: mockArticles,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });

    const { getByText } = render(<NewsList />);
    expect(getByText("Test Article")).toBeTruthy();
    expect(getByText("Test Article 2")).toBeTruthy();
  });

  it("navigates to article detail when an article is pressed", () => {
    (useNews as jest.Mock).mockReturnValue({
      data: mockArticles,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });

    const { getByText } = render(<NewsList />);
    fireEvent.press(getByText("Test Article"));

    expect(mockRouter.push).toHaveBeenCalledWith({
      pathname: "/news/[id]",
      params: {
        id: mockArticles[0].title,
        article: JSON.stringify(mockArticles[0]),
      },
    });
  });

  it("shows empty state when no articles are available", () => {
    (useNews as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });

    const { getByText } = render(<NewsList />);
    expect(getByText("There are no news available")).toBeTruthy();
  });

  it("calls refetch when retry button is pressed", async () => {
    const mockRefetch = jest.fn();
    (useNews as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error("Test error"),
      refetch: mockRefetch,
    });

    const { getByText } = render(<NewsList />);
    await act(async () => {
      fireEvent.press(getByText("Retry"));
    });

    expect(mockRefetch).toHaveBeenCalled();
  });
});
