import React, { useState } from 'react';

function UploadVideo() {
    const [files, setFiles] = useState([]);
    const [socialMedia, setSocialMedia] = useState('');
    const [socialMediaLink, setSocialMediaLink] = useState('');
    
    const handleFileChange = (e) => {
      if (e.target.files) {
        const newFiles = Array.from(e.target.files);
        setFiles(prevFiles => [...prevFiles, ...newFiles]);
      }
    };
    
    const handleDrop = (e) => {
      e.preventDefault();
      if (e.dataTransfer.files) {
        const newFiles = Array.from(e.dataTransfer.files);
        setFiles(prevFiles => [...prevFiles, ...newFiles]);
      }
    };
    
    const handleDragOver = (e) => {
      e.preventDefault();
    };
    
    const handleRemoveFile = (index) => {
      setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    };
    
    const handleSubmit = (e) => {
      e.preventDefault();
      // Handle form submission logic here
      console.log("Files:", files);
      console.log("Social Media:", socialMedia);
      console.log("Link:", socialMediaLink);
    };
  
    return (    
      <div className="upload-container">
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
          
          {/* File List */}
          {files.length > 0 && (
            <div className="file-list">
              <h3>Uploading</h3>
              {files.map((file, index) => (
                <div key={index} className="file-item">
                  <div className="file-info">
                    <div className="progress-circle">
                      {Math.floor(Math.random() * 100)}%
                    </div>
                    <span>{file.name}</span>
                  </div>
                  <div className="file-actions">
                    <span className="file-size">
                      {Math.floor(file.size / 1024)} KB
                    </span>
                    <button 
                      onClick={() => handleRemoveFile(index)}
                      className="remove-button"
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
              />
            </div>
          </div>
          
          <div className="button-container">
            <button 
              onClick={handleSubmit}
              className="primary-button"
            >
              Upload
            </button>
            
            <button className="secondary-button">
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  export default UploadVideo;