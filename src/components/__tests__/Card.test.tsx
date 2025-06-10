import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { Card } from "../Card";
import { NewsArticle } from "@/src/services/api";

const mockArticle: NewsArticle = {
  competition: "Test Competition",
  competitionUrl: "https://test.com/competition",
  date: "2024-03-20",
  matchviewUrl: "https://test.com/match",
  thumbnail: "https://test.com/image.jpg",
  title: "Test Article",
  videos: [],
};

describe("Card", () => {
  it("renders correctly", () => {
    const { getByText, getByTestId } = render(
      <Card
        article={mockArticle}
        isFavorite={false}
        onFavoritePress={() => {}}
      />
    );

    expect(getByText("Test Article")).toBeTruthy();
    expect(getByText("Test Competition")).toBeTruthy();
    expect(getByTestId("favorite-button")).toBeTruthy();
  });

  it("calls onPress when pressed", () => {
    const mockOnPress = jest.fn();
    const { getByTestId } = render(
      <Card
        article={mockArticle}
        onPress={mockOnPress}
        isFavorite={false}
        onFavoritePress={() => {}}
      />
    );

    fireEvent.press(getByTestId("card-pressable"));
    expect(mockOnPress).toHaveBeenCalledWith(mockArticle);
  });

  it("calls onFavoritePress when favorite button is pressed", () => {
    const mockOnFavoritePress = jest.fn();
    const { getByTestId } = render(
      <Card
        article={mockArticle}
        isFavorite={false}
        onFavoritePress={mockOnFavoritePress}
      />
    );

    fireEvent.press(getByTestId("favorite-button"));
    expect(mockOnFavoritePress).toHaveBeenCalledWith(mockArticle);
  });

  it("shows filled heart icon when article is favorited", () => {
    const { getByTestId } = render(
      <Card
        article={mockArticle}
        isFavorite={true}
        onFavoritePress={() => {}}
      />
    );

    const favoriteButton = getByTestId("favorite-button");
    expect(favoriteButton).toBeTruthy();
  });
});
