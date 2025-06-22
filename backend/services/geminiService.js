import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// Store extracted keywords for export
let extractedKeywords = [];

/**
 * Process video data using Gemini API
 * @param {string} base64Data - Base64 encoded video data
 * @returns {Promise<Object>} - Object containing analysis result and keywords
 */
export async function analyzeVideoFromBase64(base64Data) {
  try {
    // First API call - the one we'll return to the user
    const result = await model.generateContent({
        contents: [
          {
            parts: [
                { text: "Provide a concise 2-sentence summary of this video that clearly describes: 1) The main action or event taking place, and 2) The setting or context. If any recognizable public figures, celebrities, politicians, or well-known individuals appear in the video, explicitly identify them by full name. Focus on accurately naming only individuals who would be widely recognized by the general public. Do not speculate on the identity of unknown individuals." },
              { 
                inline_data: {
                  mime_type: "video/mp4",
                  data: base64Data
                }
              }
            ]
          }
        ]
      });
    
    // Second API call - just for logging
    try {
      // Get the first result's text
      const firstResultText = result.response.text();
      
      console.log("Making secondary API call using the first response...");
      console.log("First response:", firstResultText);
      
      // Use the first result as input for the second call
      const secondaryResult = await model.generateContent({
        contents: [
          {
            parts: [
              { 
                text: `Based on this video summary: "${firstResultText}", list 3 keywords that would be important for web scraping related content."Based on this video summary, extract exactly 3 specific keywords in this format: 1. [Person]: Any notable person identified by name in the video (if none, use most relevant subject) 2. [Location]: The setting or location where the video takes place 3. [Action]: The main action or event happening in the video. Format as a JSON of just the keywords without explanations or numbers or tags indicating location, person, action, etc. Do not put the JSON in a code block."`
              }
            ]
          }
        ]
      });
      
      // Log the second result but don't return it
      console.log("Secondary analysis result:", secondaryResult.response.text());
      
      try {
        extractedKeywords = JSON.parse(secondaryResult.response.text());
        console.log("Extracted keywords:", extractedKeywords);
      } 
      catch (e) {
        console.error("JSON parsing failed:", secondaryResult.response.text());
        // Fallback to default keywords if parsing fails
        extractedKeywords = ["news", "video", "current events", "media", "trending"];
      }
      
      // Return both the analysis text and keywords
      return {
        analysis: firstResultText,
        keywords: extractedKeywords
      };
    } catch (secondaryError) {
      // If the second call fails, just log the error but don't fail the main function
      console.error("Secondary analysis failed:", secondaryError);
      // Set fallback keywords
      extractedKeywords = ["news", "video", "current events", "media", "trending"];
      // Still return the first result even if second call fails
      return {
        analysis: result.response.text(),
        keywords: extractedKeywords
      };
    }
    
  } catch (error) {
    console.error('Error analyzing video with Gemini API:', error);
    throw new Error('Failed to analyze video with Gemini API');
  }
}

/**
 * Process video from URL using Gemini API
 * @param {string} videoUrl - URL of the video to analyze
 * @returns {Promise<Object>} - Object containing analysis result and keywords
 */
export async function analyzeVideoFromUrl(videoUrl) {
  try {
    const result = await model.generateContent({
        contents: [
          {
            parts: [
              { text: "Please summarize the video in 3 sentences. " },
              { 
                file_data: {
                  file_uri: videoUrl,
                  mime_type: "video/mp4"
                }
              }
            ]
          }
        ]
      });
    
    const analysisText = result.response.text();
    
    // For URL-based videos, we'll use a simplified approach to get keywords
    try {
      const keywordResult = await model.generateContent({
        contents: [
          {
            parts: [
              { 
                text: `Based on this video summary: "${analysisText}", extract exactly 3 specific keywords that would be useful for searching related news articles. Format as a JSON array of just the keywords without explanations.`
              }
            ]
          }
        ]
      });
      
      try {
        extractedKeywords = JSON.parse(keywordResult.response.text());
      } catch (e) {
        console.error("JSON parsing failed for URL video keywords:", e);
        extractedKeywords = ["news", "video", "current events"];
      }
    } catch (keywordError) {
      console.error("Failed to generate keywords for URL video:", keywordError);
      extractedKeywords = ["news", "video", "current events"];
    }
    
    return {
      analysis: analysisText,
      keywords: extractedKeywords
    };
  } catch (error) {
    console.error('Error analyzing video URL with Gemini API:', error);
    throw new Error('Failed to analyze video URL with Gemini API');
  }
}

// Export the keywords for other modules to use
export const getKeywords = () => extractedKeywords;

// Default export remains the same
export default analyzeVideoFromBase64;
