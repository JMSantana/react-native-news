export const mockRouter = {
  push: jest.fn(),
};

export const mockFavoritesContext = {
  toggleFavorite: jest.fn(),
  isFavorite: jest.fn(),
};

// Mock expo-router
jest.mock("expo-router", () => ({
  useRouter: jest.fn(() => mockRouter),
}));

// Mock react-native-webview
jest.mock("react-native-webview", () => ({
  WebView: "WebView",
}));
