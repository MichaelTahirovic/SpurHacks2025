import React from 'react';
import './HookText.css';

function HookText() {
    return (
        <div className="hook-text-container">
            <h1>Know what’s <span style={{color: '#1cb0eb', fontWeight: 'bold', fontSize: '4.5rem', textDecoration: 'underline'}}>REAL</span>.</h1>
            <a href="/"><button>Check your video now!</button></a>
            <div className="brief-description">
                <h2>Find a video online and think it might be AI generated?</h2>
                <h2>VerifAI will analyze your video using AI to search the web and fact-check your video!</h2>
            </div>
        </div>
    );
}

export default HookText;