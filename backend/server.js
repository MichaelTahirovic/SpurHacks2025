const express = require('express');
const cors = require('cors');
const multer = require('multer');
const dotenv = require('dotenv');
const axios = require('axios');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

dotenv.config();  // Load environment variables from .env file

const app = express();  // Create Express application
const url = "http://localhost:3000";
const PORT = process.env.PORT || 3000;  // Set port

// Middleware
app.use(cors());

// Increase payload size limits for JSON and URL-encoded data
app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({limit: '100mb', extended: true}));

// Original middleware with increased limits (as backup)
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/process-video', async (req, res) => {
  try {
    const { fileName, fileType, base64Data } = req.body;
    
    // Here you would send the base64 data to Gemini API
    console.log(`Processing video: ${fileName}, type: ${fileType}`);
    
    // Placeholder for Gemini API call
    // const geminiResponse = await callGeminiAPI(base64Data);
    
    // For now, return a mock response
    res.json({ 
      success: true, 
      message: 'Video received successfully',
      results: {
        analysis: 'This is where Gemini API results would appear'
      }
    });
  } catch (error) {
    console.error('Error processing video:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

app.post('/api/process-link', async (req, res) => {
  try {
    const { platform, url } = req.body;
    
    console.log(`Processing ${platform} link: ${url}`);
    
    // Placeholder for link processing logic
    // const videoData = await downloadVideoFromLink(platform, url);
    // const geminiResponse = await callGeminiAPI(videoData);
    
    res.json({ 
      success: true, 
      message: `${platform} link processed successfully`,
      results: {
        platform,
        url,
        analysis: 'This is where Gemini API results would appear'
      }
    });
  } catch (error) {
    console.error('Error processing link:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 