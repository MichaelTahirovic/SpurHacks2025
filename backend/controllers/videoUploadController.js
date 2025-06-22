import { analyzeVideoFromBase64, analyzeVideoFromUrl } from '../services/geminiService.js';
import { getNewsSources } from '../news/news.js';

/**
 * Process a video file that was uploaded as base64
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const processVideo = async (req, res) => {
  try {
    const { fileName, fileType, base64Data } = req.body;
    
    if (!base64Data) {
      return res.status(400).json({ 
        success: false, 
        error: 'Video data is required' 
      });
    }
    
    console.log(`Processing video: ${fileName}, type: ${fileType}`);
    
    // Call Gemini API through our service
    const analysisResult = await analyzeVideoFromBase64(base64Data);
    
    // Extract analysis text and keywords
    const { analysis, keywords } = analysisResult;
    
    console.log("Fetching news sources based on keywords:", keywords);
    
    // Get news sources based on keywords
    let sources = [];
    try {
      sources = await getNewsSources(keywords);
      console.log(`Found ${sources.length} news sources`);
    } catch (newsError) {
      console.error('Error fetching news sources:', newsError);
      // Continue even if news sources fail - don't fail the whole request
    }
    
    res.json({ 
      success: true, 
      message: 'Video processed successfully',
      results: {
        fileName,
        fileType,
        analysis,
        keywords,
        sources
      }
    });
  } catch (error) {
    console.error('Error processing video:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

/**
 * Process a video from a social media link
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const processLink = async (req, res) => {
  try {
    const { platform, url } = req.body;
    
    if (!url) {
      return res.status(400).json({
        success: false,
        error: 'URL is required'
      });
    }
    
    console.log(`Processing ${platform} link: ${url}`);
    
    // Call Gemini API through our service
    const analysisResult = await analyzeVideoFromUrl(url);
    
    // Extract analysis text and keywords
    const { analysis, keywords } = analysisResult;
    
    console.log("Fetching news sources based on keywords:", keywords);
    
    // Get news sources based on keywords
    let sources = [];
    try {
      sources = await getNewsSources(keywords);
      console.log(`Found ${sources.length} news sources`);
    } catch (newsError) {
      console.error('Error fetching news sources:', newsError);
      // Continue even if news sources fail - don't fail the whole request
    }
    
    res.json({ 
      success: true, 
      message: `${platform} link processed successfully`,
      results: {
        platform,
        url,
        analysis,
        keywords,
        sources
      }
    });
  } catch (error) {
    console.error('Error processing link:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};
