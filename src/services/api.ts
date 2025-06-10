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
// TODO: Migrate to new endpoint when we get proper authentication
const URL = "https://www.scorebat.com/video-api/v3";

// This is the new endpoint, but it needs a token to work. I'm gonna use the deprecated one to make it work publicly.
// const URL = "https://www.scorebat.com/video-api/v3/feed/";

export const fetchNews = async (): Promise<NewsArticle[]> => {
  try {
    const response = await fetch(URL);

    if (!response.ok) {
      throw new Error(
        `API call failed: ${response.status} - ${response.statusText}`
      );
    }

    const data: NewsResponse = await response.json();

    // Logs warning if it exists - we should keep an eye on this
    if (data.warning) {
      console.warn("Warning from endpoint: ", data.warning);
    }

    // In the case the API returns null or undefined for response
    if (!data.response) {
      console.warn("API returned no data");
      return [];
    }

    return data.response;
  } catch (error) {
    // Log the full error for debugging
    console.error("Failed to fetch news:", error);

    // Throw a more user-friendly error
    throw new Error("Couldn't load the news. Please try again later.");
  }
};
