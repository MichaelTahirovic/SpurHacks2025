import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './AISummary.css';

const AISummary = () => {
    const location = useLocation();
    const [videoUrl, setVideoUrl] = useState('');
    const [embedUrl, setEmbedUrl] = useState('');
    const [isVideoFromBase64, setIsVideoFromBase64] = useState(false);
    const [analysis, setAnalysis] = useState('Error: No analysis provided.');
    const [keywords, setKeywords] = useState([]);
    const [isVideoReal, setIsVideoReal] = useState(null);
    const [highlyRelevantSources, setHighlyRelevantSources] = useState(0);

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
                setEmbedUrl('');
            } else if (location.state.videoUrl) {
                setVideoUrl(location.state.videoUrl);
                setIsVideoFromBase64(false);
                // Convert the URL to an embeddable format
                const embedUrl = convertToEmbedUrl(location.state.videoUrl);
                setEmbedUrl(embedUrl);
            }
            
            // Check for highly relevant sources (score > 9)
            if (location.state.sources && Array.isArray(location.state.sources)) {
                const relevantSources = location.state.sources.filter(
                    source => source.relevance && source.relevance.score > 9
                );
                setHighlyRelevantSources(relevantSources.length);
                setIsVideoReal(relevantSources.length > 0);
            } else {
                setIsVideoReal(false);
            }
        }
    }, [location]);

    // Function to convert YouTube and other video URLs to embeddable format
    const convertToEmbedUrl = (url) => {
        if (!url) return '';
        
        // YouTube URL conversion
        const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
        const youtubeMatch = url.match(youtubeRegex);
        
        if (youtubeMatch && youtubeMatch[1]) {
            // Return YouTube embed URL with the video ID
            return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
        }
        
        // Default: return the original URL if we can't convert it
        return url;
    };

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

    const renderVerificationStatus = () => {
        if (isVideoReal === null) {
            return <h1 className="verification-pending">Verification Pending...</h1>;
        } else if (isVideoReal) {
            return (
                <div className="verification-real">
                    <h1>Video Verified as Real</h1>
                    <p className="verification-note">
                        Found {highlyRelevantSources} highly relevant source{highlyRelevantSources !== 1 ? 's' : ''} confirming this content.
                    </p>
                </div>
            );
        } else {
            return (
                <div className="verification-ai">
                    <h1>Likely AI-Generated Content</h1>
                    <p className="verification-note">
                        No highly relevant sources found to verify this content.
                    </p>
                </div>
            );
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
                        ) : embedUrl ? (
                            <iframe
                                width="100%"
                                height="100%"
                                src={embedUrl}
                                title="Video Player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        ) : (
                            <div className="no-video">
                                Unable to embed video. <a href={videoUrl} target="_blank" rel="noopener noreferrer">View original</a>
                            </div>
                        )
                    ) : (
                        <div className="no-video">No video available</div>
                    )}
                </div>
                {!isVideoFromBase64 && videoUrl && (
                    <p className="video-url">Video URL: <a href={videoUrl} target="_blank" rel="noopener noreferrer">{videoUrl}</a></p>
                )}
            </div>
            <div className="summary-section">
                {renderVerificationStatus()}
                <div className="analysis-section">
                    <h2>Analysis</h2>
                    <p>{analysis}</p>
                </div>
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