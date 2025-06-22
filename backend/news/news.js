import dotenv from 'dotenv';
import https from 'https';
import querystring from 'querystring';
import { getKeywords } from '../services/geminiService.js';

dotenv.config(); // Load env variables

/**
 * Fetch news articles based on provided keywords
 * @param {Array|Object} customKeywords - Optional array or object of keywords to search for (if not provided, uses keywords from geminiService)
 * @returns {Promise<Array>} - Array of news articles
 */
export async function getNewsSources(customKeywords = null) {
  // Use provided keywords or get them from geminiService
  const keywords = customKeywords || getKeywords();
  
  if (!keywords) {
    console.error('No keywords available for news search');
    return [];
  }
  
  // Extract search terms based on the format of keywords
  let searchTerms = '';
  
  if (Array.isArray(keywords)) {
    // If keywords is an array, join with spaces
    searchTerms = keywords.join(' ');
  } else if (typeof keywords === 'object' && keywords !== null) {
    // If keywords is an object (like { Person: 'Joe Biden', Location: 'White House' }),
    // extract just the values and join them
    const keywordValues = Object.values(keywords);
    searchTerms = keywordValues.join(' ');
    console.log('Extracted keyword values:', keywordValues);
  } else if (typeof keywords === 'string') {
    // If it's already a string, use it directly
    searchTerms = keywords;
  } else {
    console.error('Invalid keywords format:', keywords);
    return [];
  }
  
  const API_TOKEN = process.env.THENEWS_API_KEY;
  if (!API_TOKEN) {
    console.error('News API key not found in environment variables');
    return [];
  }
  
  const query = querystring.stringify({
    api_token: API_TOKEN,
    search: searchTerms,
    locale: 'us,ca',
    language: 'en',
  });
  
  console.log(`Searching news with terms: "${searchTerms}"`);
  
  const url = `https://api.thenewsapi.com/v1/news/all?${query}`;
  
  // Return a promise that resolves with the news articles
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
    
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const articles = json.data || [];
          
          if (articles.length === 0) {
            console.log('No articles found.');
            resolve([]);
            return;
          }
          
          // Format articles for frontend display
          const formattedArticles = articles.map((article, i) => {
            console.log(`${i + 1}. ${article.title}`);
            console.log(`   Source: ${article.source}`);
            console.log(`   ${article.url}\n`);
            
            return {
              title: article.title,
              source: article.source,
              url: article.url,
              description: article.description || '',
              image_url: article.image_url || '',
              published_at: article.published_at
            };
          });
          
          resolve(formattedArticles);
        } catch (err) {
          console.error('JSON parse error:', err.message);
          reject(err);
        }
      });
    }).on('error', (err) => {
      console.error('HTTPS error:', err.message);
      reject(err);
    });
  });
}

export default getNewsSources;