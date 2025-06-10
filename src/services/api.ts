export interface NewsArticle {
  competition: string;
  competitionUrl: string;
  date: string;
  matchviewUrl: string;
  thumbnail: string;
  title: string;
  videos: {
    embed: string;
  }[];
}

export interface NewsResponse {
  status: string;
  response: NewsArticle[];
  // There is a warning to tell things like deprecation, etc.
  warning: string;
}

// This endpoint is deprecated, I'm gonna use it, but watch out for the warning message.
const URL = "https://www.scorebat.com/video-api/v3";

// This is tne new endpoint, but it needs a token to work. I'm gonna use the deprecated one to make it work publicly.
// const URL = "https://www.scorebat.com/video-api/v3/feed/";

export const fetchNews = async (): Promise<NewsArticle[]> => {
  try {
    const response = await fetch(URL);

    if (!response.ok) {
      throw new Error("There was an error fetching the news articles.");
    }

    const data: NewsResponse = await response.json();
    // Logs warning if it exists
    if (data.warning) {
      console.warn("Warning from endpoint: ", data.warning);
    }

    return data.response || [];
  } catch (error) {
    console.error("There was an error fetching the news articles:", error);
    throw error;
  }
};
