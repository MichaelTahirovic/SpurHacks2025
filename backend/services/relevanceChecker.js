import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

/**
 * Check the relevance of news articles to video analysis
 * @param {string} videoAnalysis - The analysis of the video from Gemini
 * @param {Array} articles - Array of news articles to check
 * @returns {Promise<Array>} - Articles with added relevance scores
 */
export async function checkArticleRelevance(videoAnalysis, articles) {
  if (!videoAnalysis || !articles || articles.length === 0) {
    console.log("No video analysis or articles to check relevance");
    return articles;
  }

  console.log(`Checking relevance for ${articles.length} articles`);
  
  // Process up to 3 articles (limit API calls)
  const articlesToProcess = articles.slice(0, 3);
  const enhancedArticles = [];
  
  for (const article of articlesToProcess) {
    try {
      // Extract article information
      const title = article.title || "No title";
      const description = article.description || "No description";
      const source = article.source || "Unknown source";
      
      console.log(`Checking relevance for article: "${title}"`);
      
      // Create prompt for Gemini
      const prompt = `
I need to evaluate the relevance of a news article to a video.

VIDEO ANALYSIS:
"${videoAnalysis}"

NEWS ARTICLE:
Title: "${title}"
Source: "${source}"
Description: "${description}"

On a scale from 1 to 10, how relevant is this article to the video described in the analysis?
1 = Completely unrelated
5 = Somewhat related
10 = Highly relevant, directly discusses the same topic

Please respond with ONLY a numerical score between 1 and 10, with no other text, formatting, or explanation.
`;

      // Call Gemini API
      const result = await model.generateContent({
        contents: [{ parts: [{ text: prompt }] }]
      });
      
      const responseText = result.response.text();
      console.log("Relevance check response:", responseText);
      
      let relevanceScore = 0;
      
      try {
        // First try to extract just the number from the response
        const numberMatch = responseText.match(/\b([1-9]|10)\b/);
        if (numberMatch && numberMatch[0]) {
          relevanceScore = parseInt(numberMatch[0], 10);
          console.log(`Extracted score: ${relevanceScore}`);
        } else {
          // If no direct number found, try to clean and parse JSON
          // Remove markdown code blocks and any text before/after JSON
          const cleanedText = responseText
            .replace(/```json|```/g, '')  // Remove code block markers
            .trim();
            
          // Find the first { which likely starts the JSON
          const jsonStartIndex = cleanedText.search(/\{/);
          if (jsonStartIndex >= 0) {
            // Find the last } which likely ends the JSON
            const jsonEndIndex = cleanedText.lastIndexOf('}') + 1;
            if (jsonEndIndex > 0) {
              const jsonString = cleanedText.substring(jsonStartIndex, jsonEndIndex);
              const relevanceData = JSON.parse(jsonString);
              relevanceScore = relevanceData.score || 0;
              console.log(`Parsed JSON score: ${relevanceScore}`);
            }
          }
        }
      } catch (e) {
        console.error("Failed to parse relevance data:", e);
        console.error("Raw response:", responseText);
        
        // Last resort: try to find any number in the response
        const anyNumberMatch = responseText.match(/\d+/);
        if (anyNumberMatch && anyNumberMatch[0]) {
          const extractedNumber = parseInt(anyNumberMatch[0], 10);
          // Only use if it's in the valid range
          if (extractedNumber >= 1 && extractedNumber <= 10) {
            relevanceScore = extractedNumber;
            console.log(`Fallback extracted score: ${relevanceScore}`);
          }
        }
      }
      
      // Add relevance data to article
      enhancedArticles.push({
        ...article,
        relevance: {
          score: relevanceScore
        }
      });
      
    } catch (error) {
      console.error(`Error checking relevance for article "${article.title}":`, error);
      // Add the article without relevance data
      enhancedArticles.push({
        ...article,
        relevance: {
          score: 0
        }
      });
    }
  }
  
  // Add any remaining articles without relevance checks if there are more than 3
  if (articles.length > 3) {
    for (let i = 3; i < articles.length; i++) {
      enhancedArticles.push({
        ...articles[i],
        relevance: {
          score: 0
        }
      });
    }
  }
  
  // Sort articles by relevance score (highest first)
  enhancedArticles.sort((a, b) => b.relevance.score - a.relevance.score);
  
  return enhancedArticles;
}

export default checkArticleRelevance; 