import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { NewsDetail } from "../NewsDetail";
import { mockArticle } from "../../../test-utils/mockData";
import "../../../test-utils/mocks";

const mockRouter = {
  push: jest.fn(),
};

jest.mock("expo-router", () => ({
  useRouter: jest.fn(() => mockRouter),
}));

jest.mock("react-native-webview", () => ({
  WebView: "WebView",
}));

describe("NewsDetail", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders article details correctly", () => {
    const { getByText, getByTestId } = render(
      <NewsDetail article={mockArticle} />
    );

    expect(getByText(mockArticle.title)).toBeTruthy();
    expect(getByText(mockArticle.competition)).toBeTruthy();
    expect(
      getByText(new Date(mockArticle.date).toLocaleDateString())
    ).toBeTruthy();

    const image = getByTestId("article-image");
    expect(image.props.source.uri).toBe(mockArticle.thumbnail);
  });

  it("navigates back when back button is pressed", () => {
    const { getByTestId } = render(<NewsDetail article={mockArticle} />);

    const backButton = getByTestId("back-button");
    fireEvent.press(backButton);

    expect(mockRouter.push).toHaveBeenCalledWith("/");
  });

  it("renders correctly without videos", () => {
    const articleWithoutVideos = { ...mockArticle, videos: [] };
    const { queryByText } = render(
      <NewsDetail article={articleWithoutVideos} />
    );

    expect(queryByText("Test Video")).toBeNull();
  });
});
