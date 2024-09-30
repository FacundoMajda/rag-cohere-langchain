import "dotenv/config";

export const env = {
  cohere: {
    cohere_api_key: process.env.COHERE_API_KEY,
  },
  chroma: {
    chroma_api_key: process.env.CHROMA_API_KEY,
  },
  tavily: {
    tavily_api_key: process.env.TAVILY_API_KEY,
  },
};
