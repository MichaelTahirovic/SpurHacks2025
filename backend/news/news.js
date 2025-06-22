import dotenv from 'dotenv';
import https from 'https';
import querystring from 'querystring';

dotenv.config(); // Load env variables

const API_TOKEN = process.env.NEWS_API_KEY; // Change
const keywords = ['Trump', 'milk', 'cereal']; // Temp for testing
const combinedSearch = keywords.join(' ');
console.log(combinedSearch); // Remove

const query = querystring.stringify({
  api_token: API_TOKEN,
  search: combinedSearch,
  locale: 'us',
  language: 'en',
});
console.log(query); // Testing

const url = `https://api.thenewsapi.com/v1/news/all?${query}`;

https.get(url, (res) => {
    let data = '';
  
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      try {
        const json = JSON.parse(data);
        articles = json.data
        if (!json.data) {
          console.error('No articles found.');
          return;
        }
  
        articles.forEach((article, i) => {
            console.log(`${i + 1}. ${article.title}`);
            console.log(`   Source: ${article.source}`);
            console.log(`   ${article.url}\n`);
          });
      } catch (err) {
        console.error('JSON parse error:', err.message);
      }
    });
  }).on('error', (err) => {
    console.error('HTTPS error:', err.message);
  });

  