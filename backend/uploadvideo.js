import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const base64VideoFile = fs.readFileSync("C:/Users/emad_/Downloads/Spurhacks/SpurHacks2025/backend/testvideos/sleepyjoe.mp4", {
    encoding: "base64",
  });

async function main() {
    const contents = [
        {
          inlineData: {
            mimeType: "video/mp4",
            data: base64VideoFile,
          },
        },
        { text: "Please summarize the video in 3 sentences." }
    ]; 
   const response = await ai.models.generateContent({
     model: "gemini-2.5-flash",
     contents: contents,
     config: {
       thinkingConfig: {
         thinkingBudget: 0, // Disables thinking
       },
     }
   });
   console.log(response.text);
}

await main();