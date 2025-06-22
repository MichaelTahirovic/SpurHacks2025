import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './SourceList.css';

const Article = ({ article }) => {
    return (
        <div target="_blank" rel="noopener noreferrer" className="article-card-link">
            <div className="article-card">
                <div className="article-image">
                    <img src={article.image || 'https://i.imgur.com/gS5gL6z.png'} alt={article.title} />
                </div>
                <div className="article-content">
                    <div className="article-header">
                        <h2>{article.title}</h2>
                        <p className="author">Author: {article.author}, Published: {article.date}</p>
                    </div>
                    <p>{article.description}</p>
                </div>
                <a href={article.url} className="article-action">
                    <span className="read-article-text">Read Article</span>
                    <span className="arrow">&gt;</span>
                </a>
            </div>
        </div>
    );
};

/* testing articles */
const testingArticles = [
    {
        id: 1,
        url: 'https://www.example.com/article1',
        title: 'Test Article 1: The Rise of AI',
        description: 'A deep dive into the recent advancements in artificial intelligence and machine learning.',
        image: 'https://i.imgur.com/gS5gL6z.png',
        author: 'Jane Doe',
        date: 'Oct 26, 2023'
    },
    {
        id: 2,
        url: 'https://www.example.com/article2',
        title: 'Test Article 2: Understanding Deepfakes',
        description: 'How to spot deepfakes and understand the technology behind them.',
        image: 'https://i.imgur.com/gS5gL6z.png',
        author: 'John Smith',
        date: 'Oct 25, 2023'
    },
];

const SourceList = () => {
    const location = useLocation();
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        if (location.state && location.state.sources && location.state.sources.length > 0) {
            // Adapt the incoming sources data to the format expected by the Article component
            const adaptedArticles = location.state.sources
                .map((source, index) => ({
                    id: index,
                    url: source.url,
                    title: source.title || 'No Title Provided',
                    description: source.description || 'No description available.',
                    image: source.image_url || 'https://i.imgur.com/gS5gL6z.png',
                    author: source.source || 'Unknown',
                    date: source.published_at ? new Date(source.published_at).toLocaleDateString() : 'N/A',
                    relevance: source.relevance || null
                }))
                // Filter out articles with relevance score <= 9 or no relevance score
                .filter(article => article.relevance && article.relevance.score > 9);
            
            setArticles(adaptedArticles);
        } else {
            // If no sources are passed via location state, use the testing articles.
            setArticles(testingArticles);
        }
    }, [location]);

    return (
        <div className="source-list-container">
            {articles.length > 0 ? (
                <>
                    <div className="source-list-header">
                        <h1>Verified Sources</h1>
                        <p>Here are highly relevant articles VerifAI found relating to your video.</p>
                    </div>
                    <div className="articles-list">
                        {articles.map(article => (
                            <Article key={article.id} article={article} />
                        ))}
                    </div>
                </>
            ) : (
                <div className="source-list-header">
                    <h1>No highly relevant sources found</h1>
                    <p>VerifAI was unable to find any highly relevant sources for your video.</p>
                </div>
            )}
        </div>
    );
};

export default SourceList; 