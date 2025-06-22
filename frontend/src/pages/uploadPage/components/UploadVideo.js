import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './UploadVideo.css';


function UploadVideo() {
  const API_URL = "http://localhost:5000";
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [socialMedia, setSocialMedia] = useState('');
  const [socialMediaLink, setSocialMediaLink] = useState('');
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState('');
  const abortControllerRef = useRef(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const handleFileChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      
      // Check file size - warn if over 50MB
      const oversizedFiles = newFiles.filter(file => file.size > 50 * 1024 * 1024);
      if (oversizedFiles.length > 0) {
        setError(`Warning: Some files exceed 50MB and may cause upload issues.`);
      } else {
        setError('');
      }
      
      setFiles(prevFiles => [...prevFiles, ...newFiles]);
    }
  };

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      const newFiles = Array.from(e.dataTransfer.files);
      
      // Check file size - warn if over 50MB
      const oversizedFiles = newFiles.filter(file => file.size > 50 * 1024 * 1024);
      if (oversizedFiles.length > 0) {
        setError(`Warning: Some files exceed 50MB and may cause upload issues.`);
      } else {
        setError('');
      }
      
      setFiles(prevFiles => [...prevFiles, ...newFiles]);
    }
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  
  const handleRemoveFile = (index) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    if (files.length <= 1) {
      setError('');
    }
  };
  
  // Function to simulate progress updates
  const simulateProgress = () => {
    // Reset progress
    setUploadProgress(0);
    
    // Create an interval that updates progress
    const interval = setInterval(() => {
      setUploadProgress(prevProgress => {
        // Increment progress, but cap at 95% (final 5% when response comes back)
        const newProgress = prevProgress + Math.random() * 5;
        if (newProgress >= 95) {
          clearInterval(interval);
          return 95;
        }
        return newProgress;
      });
    }, 500);
    
    // Store interval ID to clear it later
    return interval;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsUploading(true);
    setAnalysisResult('');
    setUploadProgress(0);
    
    // Create a new AbortController for this upload
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;
    
    // Start the progress simulation
    const progressInterval = simulateProgress();
    
    try {
      if (files.length > 0) {
        // Handle file upload
        const file = files[0]; // Process first file if multiple
        
        // Log file size for debugging
        console.log(`File size: ${file.size} bytes (${(file.size / (1024 * 1024)).toFixed(2)} MB)`);
        
        if (file.size > 90 * 1024 * 1024) {
          setError("File is too large. Please select a file under 90MB.");
          setIsUploading(false);
          clearInterval(progressInterval);
          return;
        }
        
        const base64 = await convertBase64(file);
        
        // Remove the prefix from base64 string if needed
        const base64Data = base64.split(',')[1];
        
        // Log base64 size for debugging
        console.log(`Base64 data size: ${base64Data.length} chars (${(base64Data.length / (1024 * 1024)).toFixed(2)} MB)`);
        
        // Send to backend - updated endpoint with abort signal
        const response = await fetch(`${API_URL}/api/videos/process`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
            base64Data: base64Data
          }),
          signal // Add the abort signal
        });
        
        const result = await response.json();
        console.log("Backend response:", result);
        
        // Set progress to 100% when complete
        setUploadProgress(100);
        
        if (result.success) {
          setAnalysisResult(result.results.analysis);
          // Navigate to results page with data
          navigate('/displaySources', { 
            state: { 
              analysis: result.results.analysis,
              sources: result.results.sources || [],
              keywords: result.results.keywords || [],
              videoData: base64Data // Pass the base64 video data to display on results page
            } 
          });
        } else {
          setError(result.error || 'An error occurred during processing');
        }
      } 
      else if (socialMediaLink) {
        // Handle social media link - updated endpoint with abort signal
        const response = await fetch(`${API_URL}/api/videos/process-link`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            platform: socialMedia,
            url: socialMediaLink
          }),
          signal // Add the abort signal
        });
        
        const result = await response.json();
        console.log("Backend response for link:", result);
        
        // Set progress to 100% when complete
        setUploadProgress(100);
        
        if (result.success) {
          setAnalysisResult(result.results.analysis);
          // Navigate to results page with data
          navigate('/displaySources', { 
            state: { 
              analysis: result.results.analysis,
              sources: result.results.sources || [],
              keywords: result.results.keywords || [],
              videoUrl: socialMediaLink // Pass the video URL for display on results page
            } 
          });
        } else {
          setError(result.error || 'An error occurred during processing');
        }
      }
    } catch (error) {
      // Check if the error was caused by an abort
      if (error.name === 'AbortError') {
        console.log('Upload was cancelled');
        setError('Upload cancelled');
      } else {
        console.error("Error processing upload:", error);
        setError(`Upload failed: ${error.message}`);
      }
    } finally {
      setIsUploading(false);
      clearInterval(progressInterval);
    }
  };

  // Function to handle cancellation
  const handleCancel = () => {
    if (isUploading && abortControllerRef.current) {
      // Abort the current fetch request
      abortControllerRef.current.abort();
      setIsUploading(false);
      setUploadProgress(0);
    }
    
    // Reset the form
    setFiles([]);
    setSocialMediaLink('');
    setError('');
    setAnalysisResult('');
  };

  return (
    <div id="upload-video" className="upload-container">
      {/* Left Side - File Upload */}
      <div className="upload-section">
        <h2 className="section-title">File Upload</h2>
        
        <div 
          className="drop-area"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <div className="upload-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-12v4h-2l3 3 3-3h-2V8h-2z"/>
            </svg>
          </div>
          <p>Drag and Drop Files</p>
          <p>Or</p>
          <label htmlFor="file-input" className="browse-button">
            Browse
          </label>
          <input 
            id="file-input" 
            type="file" 
            accept="video/*" 
            onChange={handleFileChange} 
            style={{ display: 'none' }}
            multiple
          />
        </div>
        
        {error && (
          <div style={{ color: 'red', marginTop: '10px', textAlign: 'center' }}>
            {error}
          </div>
        )}
        
        {/* File List */}
        {files.length > 0 && (
          <div className="file-list">
            <h3>Uploading</h3>
            {files.map((file, index) => (
              <div key={index} className="file-item">
                <div className="file-info">
                  <span>{file.name}</span>
                </div>
                <div className="file-actions">
                  <span className="file-size">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </span>
                  <button 
                    onClick={() => handleRemoveFile(index)}
                    className="remove-button"
                    disabled={isUploading}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Divider */}
      <div className="divider">
        <div className="divider-text">
          OR
        </div>
      </div>
      
      {/* Right Side - Social Media Link */}
      <div className="link-section">
        <h2 className="section-title center">Social Media Link</h2>
        
        <div>
          <div className="form-group">
            <label htmlFor="social-media" className="form-label">
              Select Platform
            </label>
            <select 
              id="social-media"
              value={socialMedia}
              onChange={(e) => setSocialMedia(e.target.value)}
              className="form-control"
              disabled={isUploading}
            >
              <option value="">Select a platform</option>
              <option value="youtube">YouTube</option>
              <option value="tiktok">TikTok</option>
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
              <option value="twitter">Twitter</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="social-link" className="form-label">
              Video Link
            </label>
            <input 
              id="social-link"
              type="url"
              value={socialMediaLink}
              onChange={(e) => setSocialMediaLink(e.target.value)}
              placeholder="Paste your video URL here"
              className="form-control"
              disabled={isUploading}
            />
          </div>
        </div>
        
        <div className="button-container">
          <div className="buttons-wrapper">
            <button 
              onClick={handleSubmit}
              className="primary-button"
              disabled={isUploading}
            >
              {isUploading ? 'Uploading...' : 'Upload'}
            </button>
            
            <button 
              className="secondary-button"
              onClick={handleCancel}
            >
              {isUploading ? 'Stop Upload' : 'Cancel'}
            </button>
          </div>
          
          {isUploading && (
            <div className="progress-container">
              <div 
                className="progress-bar" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
              <div className="progress-text">{Math.round(uploadProgress)}%</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UploadVideo; 