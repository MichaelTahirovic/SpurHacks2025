import React from 'react';
import './AISummary.css';

const AISummary = () => {
    return (
        <div className="ai-summary-container">
            <div className="video-section">
                <div className="video-player">
                    <iframe
                        width="100%"
                        height="100%"
                        src="https://www.youtube.com/embed/dQw4w9WgXcQ" // Placeholder video
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
                <p className="video-url">Video URL: https://www.youtube.com/embed/dQw4w9WgXcQ</p>
            </div>
            <div className="summary-section">
                <h1>AI Detected!* (Probably)</h1>
                <p>
                    According to our algorithms, this video is most likely* AI generated.
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                    eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                    ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                    aliquip ex ea commodo consequat. Duis aute irure dolor in
                    reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                    pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa
                    qui officia deserunt mollit anim id est laborum.
                </p>
                <button className="upload-another-button">Upload Another Video?</button>
            </div>
        </div>
    );
};

export default AISummary; 