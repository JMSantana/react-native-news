import { NewsArticle } from "../services/api";

export const mockArticle: NewsArticle = {
  title: "Test Article",
  competition: "Test Competition",
  competitionUrl: "https://test.com/competition",
  date: "2024-03-20",
  matchviewUrl: "https://test.com/match",
  thumbnail: "https://test.com/image.jpg",
  videos: [
    {
      embed: "<iframe>test</iframe>",
    },
  ],
};

export const mockArticles: NewsArticle[] = [
  mockArticle,
  {
    title: "Test Article 2",
    competition: "Test Competition 2",
    competitionUrl: "https://test.com/competition2",
    date: "2024-03-21",
    matchviewUrl: "https://test.com/match2",
    thumbnail: "https://test.com/image2.jpg",
    videos: [],
  },
];
