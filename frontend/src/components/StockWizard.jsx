import React, { useState, useEffect } from 'react';

const StockWizard = () => {
    const [items, setItems] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch stock items when the component loads or resets
const fetchStock = async () => {
    try {
        const response = await fetch('/api/stock'); // Relative URL for serverless function
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setItems(data);
        setCurrentIndex(0);
        setLoading(false);
    } catch (error) {
        console.error('Error fetching stock:', error);
        setLoading(false);
    }
};


        fetchStock();
    }, []); // Runs once when the component mounts

    const updateStock = async (id, level) => {
        try {
            await fetch(`/api/stock/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ level }),
            });

            // Move to the next item
            setCurrentIndex((prevIndex) => prevIndex + 1);
        } catch (error) {
            console.error('Error updating stock:', error);
        }
    };

    if (loading) {
        return <p>Loading stock items...</p>;
    }

    if (currentIndex >= items.length) {
        return (
            <div>
                <p>All items updated!</p>
                <button onClick={() => setCurrentIndex(0)}>Start Over</button>
            </div>
        );
    }

    const currentItem = items[currentIndex];

    return (
        <div>
            <h2>Stock Wizard</h2>
            <p>Item: {currentItem.name}</p>
            <div>
                <button onClick={() => updateStock(currentItem.id, 'Low')}>Low</button>
                <button onClick={() => updateStock(currentItem.id, 'Medium')}>Medium</button>
                <button onClick={() => updateStock(currentItem.id, 'High')}>High</button>
            </div>
        </div>
    );
};

export default StockWizard;
