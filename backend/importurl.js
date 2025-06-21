import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
const result = await model.generateContent([
  "Please summarize the video in 3 sentences.",
  {
    fileData: {
      fileUri: "https://www.youtube.com/watch?v=U5Mwc12LtRY",
    },
  },
]);
console.log(result.response.text());