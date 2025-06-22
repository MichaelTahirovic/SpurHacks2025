import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AISummary from "./components/AISummary";
import SourceList from "./components/SourceList";


function DisplaySourcesPage() {
  const location = useLocation();
  const [videoUrl, setVideoUrl] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [sources, setSources] = useState([]);

  useEffect(() => {
    // Get data passed from the upload page
    if (location.state) {
      setAnalysis(location.state.analysis || '');
      setSources(location.state.sources || []);
      
      // Handle video display based on what was passed
      if (location.state.videoData) {
        // Convert base64 to video URL
        const base64Video = location.state.videoData;
        convertBase64ToVideo(base64Video);
      } else if (location.state.videoUrl) {
        // Use direct URL from social media
        setVideoUrl(location.state.videoUrl);
      }
    }
  }, [location]);

  // Convert base64 to Blob and create object URL
  const convertBase64ToVideo = (base64String) => {
    try {
      // Remove data URL prefix if present
      const base64WithoutPrefix = base64String.includes(',') 
        ? base64String.split(',')[1] 
        : base64String;
      
      // Convert base64 to binary
      const binaryString = window.atob(base64WithoutPrefix);
      const bytes = new Uint8Array(binaryString.length);
      
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      // Create blob and object URL
      const blob = new Blob([bytes], { type: 'video/mp4' });
      const url = URL.createObjectURL(blob);
      
      setVideoUrl(url);
    } catch (error) {
      console.error("Error converting base64 to video:", error);
    }
  };

  return (
    <div>
      <h1>Analysis Results</h1>
      <div className="main-container">
        <div className="main-result">
          {videoUrl && (
            <div className="video-container">
              <video 
                controls 
                width="640" 
                height="360"
                src={videoUrl}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </div>
        
        <div className="ai-explanation">
          <h2>AI Analysis</h2>
          <p>{analysis}</p>
        </div>
        
        <div className="sources-container">
          <h2>Sources</h2>
          {sources.length > 0 ? (
            <ul className="sources-list">
              {sources.map((source, index) => (
                <li key={index} className="source-item">
                  <a href={source.url} target="_blank" rel="noopener noreferrer">
                    {source.title || source.url}
                  </a>
                  {source.description && <p>{source.description}</p>}
                </li>
              ))}
            </ul>
          ) : (
            <p>No sources available</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default DisplaySourcesPage; 