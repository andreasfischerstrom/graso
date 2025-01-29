import React from 'react';
import '../styles/card.css';

const Card = ({ title, content, subtitle }) => {
    return (
        <div className="card">
            <h2 className="card-title">{title}</h2>
            {subtitle && <p className="card-subtitle">{subtitle}</p>}
            <div className="card-content">{content}</div>
        </div>
    );
};

export default Card;
