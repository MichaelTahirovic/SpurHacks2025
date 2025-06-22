import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

/**
 * Process video data using Gemini API
 * @param {string} base64Data - Base64 encoded video data
 * @returns {Promise<string>} - Analysis result from Gemini
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
                text: `Based on this video summary: "${firstResultText}", list 5 keywords that would be important for web scraping related content."Based on this video summary, extract exactly 5 specific keywords in this format: 1. [Person]: Any notable person identified by name in the video (if none, use most relevant subject) 2. [Location]: The setting or location where the video takes place 3. [Action]: The main action or event happening in the video 4. [Object]: An important object or item featured in the video 5. [Context]: The overall context, situation, or category of the video. Format as a JSON of just the keywords without explanations or numbers or tags indicating location, person, action, etc. Do not put the JSON in a code block."`
              }
            ]
          }
        ]
      });
      
      // Log the second result but don't return it
      console.log("Secondary analysis result:", secondaryResult.response.text());
      let keywords;
      try {
        keywords = JSON.parse(secondaryResult.response.text());
        console.log("Extracted keywords:", keywords);
      } 
      catch (e) {
        console.error("JSON parsing failed:", secondaryResult.response.text());
      }
      
      // Return the first result
      return firstResultText;
    } catch (secondaryError) {
      // If the second call fails, just log the error but don't fail the main function
      console.error("Secondary analysis failed:", secondaryError);
      // Still return the first result even if second call fails
      return result.response.text();
    }
    
    // The return is now handled in the try/catch blocks above
  } catch (error) {
    console.error('Error analyzing video with Gemini API:', error);
    throw new Error('Failed to analyze video with Gemini API');
  }
}

/**
 * Process video from URL using Gemini API
 * @param {string} videoUrl - URL of the video to analyze
 * @returns {Promise<string>} - Analysis result from Gemini
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
    
    return result.response.text();
  } catch (error) {
    console.error('Error analyzing video URL with Gemini API:', error);
    throw new Error('Failed to analyze video URL with Gemini API');
  }
}

export default analyzeVideoFromBase64;
