import React from 'react';
import '../styles/card.css'; // Import card styles

const Card = ({ title, content }) => {
    return (
        <div className="card">
            <h2 className="card-title">{title}</h2>
            <div className="card-content">{content}</div>
        </div>
    );
};

export default Card;
