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
    const result = await model.generateContent({
        contents: [
          {
            parts: [
              { text: "Please summarize the video in 3 sentences." },
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
    
    return result.response.text();
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
              { text: "Please summarize the video in 3 sentences." },
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
    
    return result.response.text();
  } catch (error) {
    console.error('Error analyzing video URL with Gemini API:', error);
    throw new Error('Failed to analyze video URL with Gemini API');
  }
}
