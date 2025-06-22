import express from 'express';
import { processVideo, processLink } from '../controllers/videoUploadController.js';

const router = express.Router();

/**
 * @route POST /api/videos/process
 * @desc Process uploaded video file
 * @access Public
 */
router.post('/process', processVideo);

/**
 * @route POST /api/videos/process-link
 * @desc Process video from social media link
 * @access Public
 */
router.post('/process-link', processLink);

export default router;
