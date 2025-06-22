import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './AISummary.css';

const AISummary = () => {
    const location = useLocation();
    const [videoUrl, setVideoUrl] = useState('');
    const [isVideoFromBase64, setIsVideoFromBase64] = useState(false);
    const [analysis, setAnalysis] = useState('Error: No analysis provided.');
    const [keywords, setKeywords] = useState([]);

    useEffect(() => {
        if (location.state) {
            // Handle analysis text - might be directly a string or part of an object
            if (typeof location.state.analysis === 'string') {
                setAnalysis(location.state.analysis || 'No analysis provided.');
            } else if (location.state.analysis && location.state.analysis.analysis) {
                // Handle nested structure if present
                setAnalysis(location.state.analysis.analysis);
            }

            // Store keywords if available
            if (location.state.keywords) {
                setKeywords(location.state.keywords);
            }

            // Handle video data
            if (location.state.videoData) {
                convertBase64ToVideo(location.state.videoData);
                setIsVideoFromBase64(true);
            } else if (location.state.videoUrl) {
                setVideoUrl(location.state.videoUrl);
                setIsVideoFromBase64(false);
            }
        }
    }, [location]);

    const convertBase64ToVideo = (base64String) => {
        try {
            const base64WithoutPrefix = base64String.includes(',')
                ? base64String.split(',')[1]
                : base64String;
            
            const binaryString = window.atob(base64WithoutPrefix);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            
            const blob = new Blob([bytes], { type: 'video/mp4' });
            const url = URL.createObjectURL(blob);
            setVideoUrl(url);
        } catch (error) {
            console.error("Error converting base64 to video:", error);
            setVideoUrl('');
        }
    };

    return (
        <div className="ai-summary-container">
            <div className="video-section">
                <div className="video-player">
                    {videoUrl ? (
                        isVideoFromBase64 ? (
                            <video controls width="100%" height="100%" src={videoUrl}>
                                Your browser does not support the video tag.
                            </video>
                        ) : (
                            <iframe
                                width="100%"
                                height="100%"
                                src={videoUrl}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        )
                    ) : (
                        <div className="no-video">No video available</div>
                    )}
                </div>
                {!isVideoFromBase64 && videoUrl && (
                    <p className="video-url">Video URL: {videoUrl}</p>
                )}
            </div>
            <div className="summary-section">
                <h1>AI Analysis</h1>
                <p>{analysis}</p>
                {keywords && keywords.length > 0 && (
                    <div className="keywords-section">
                        <h3>Keywords</h3>
                        <div className="keywords-list">
                            {keywords.map((keyword, index) => (
                                <span key={index} className="keyword-tag">{keyword}</span>
                            ))}
                        </div>
                    </div>
                )}
                <a href="/"><button className="upload-another-button">Upload Another Video?</button></a>
            </div>
        </div>
    );
};

export default AISummary; 