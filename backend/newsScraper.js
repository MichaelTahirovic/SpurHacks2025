import env from "dotenv";
import fs from "fs";
import fetch from "node-fetch"; // Ensure you have node-fetch installed: npm install node-fetch
env.config();

const API_KEY = process.env.NEWS_API_KEY;

let words = ['biden'];
let string = words.join('20%');

const url = `https://newsdata.io/api/1/latest?apikey=${API_KEY}&q=${string}&language=en&country=us`;

async function fetchAndSaveNews() {
  try {
    console.log("Fetching news data...");
    console.log("URL:", url); // Debugging log to check the URL

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("API Response:", data); // Debugging log to check the API response

    // Ensure `data.results` exists
    if (!data.results || !Array.isArray(data.results)) {
      throw new Error("API response does not contain 'results' or it is not an array.");
    }

    // Filter the data to include only the required fields
    const filteredResults = data.results.map((article) => ({
      title: article.title || "No Title Available", // Fallback for missing title
      link: article.link || "No Link Available", // Fallback for missing link
      description: article.description || "No Description Available", // Fallback for missing description
    }));

    console.log("Filtered Results:", filteredResults); // Debugging log to check filtered results

    // Write the filtered data to a JSON file
    console.log("Writing data to file...");
    const filePath = "/Users/surjo/Documents/PERSONAL/SpurHacks2025/backend/filteredNewsData.json";
    fs.writeFileSync(filePath, JSON.stringify(filteredResults, null, 2), { flag: "w" });
    console.log("File writing completed...");
  } catch (error) {
    console.error("Error:", error.message);
  }
}

console.log("Program started...");
fetchAndSaveNews();



