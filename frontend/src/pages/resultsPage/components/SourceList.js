import React from 'react';
import './SourceList.css';

const articlesData = [
    {
        id: 1,
        image: 'https://i.imgur.com/gS5gL6z.png',
        title: 'Article Title',
        author: 'Name',
        date: 'Date Published',
        description: 'Brief description of article. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    },
    {
        id: 2,
        image: 'https://i.imgur.com/gS5gL6z.png',
        title: 'Article Title',
        author: 'Name',
        date: 'Date Published',
        description: 'Brief description of article. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    },
    {
        id: 3,
        image: 'https://i.imgur.com/gS5gL6z.png',
        title: 'Article Title',
        author: 'Name',
        date: 'Date Published',
        description: 'Brief description of article. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    },
];

const Article = ({ article }) => {
    return (
        <div className="article-card">
            <div className="article-image">
                <img src={article.image} alt={article.title} />
            </div>
            <div className="article-content">
                <div className="article-header">
                    <h2>{article.title}</h2>
                    <span>{article.date}</span>
                </div>
                <p className="author">Author: {article.author}</p>
                <p>{article.description}</p>
            </div>
            <div className="article-action">
                <span className="read-article-text">Read Article</span>
                <span className="arrow">&gt;</span>
            </div>
        </div>
    );
};

const SourceList = () => {
    return (
        <div className="source-list-container">
            {articlesData.length > 0 ? (
                <>
                    <div className="source-list-header">
                        <h1>Discovered Sources</h1>
                        <p>Here are some articles VerifAI found relating to your video.</p>
                    </div>
                    <div className="articles-list">
                        {articlesData.map(article => (
                            <Article key={article.id} article={article} />
                        ))}
                    </div>
                </>
            ) : (
                <div className="source-list-header">
                    <h1>No sources found</h1>
                    <p>VerifAI was unable to find any sources relating to your video.</p>
                </div>
            )}
        </div>
    );
};

export default SourceList; 