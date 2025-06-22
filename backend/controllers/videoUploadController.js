import { analyzeVideoFromBase64, analyzeVideoFromUrl } from '../services/geminiService.js';

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
    const analysis = await analyzeVideoFromBase64(base64Data);
    
    res.json({ 
      success: true, 
      message: 'Video processed successfully',
      results: {
        fileName,
        fileType,
        analysis
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
    const analysis = await analyzeVideoFromUrl(url);
    
    res.json({ 
      success: true, 
      message: `${platform} link processed successfully`,
      results: {
        platform,
        url,
        analysis
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
