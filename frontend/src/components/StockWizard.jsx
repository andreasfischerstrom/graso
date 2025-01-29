import React, { useState, useEffect } from 'react';

const StockWizard = () => {
    const [items, setItems] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStock = async () => {
            try {
                const response = await fetch('/api/stock');
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
    }, []);

    const updateStockLevel = async (id, level) => {
        const response = await fetch('/api/stock', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, level }),
        });

        if (!response.ok) {
            console.error('Failed to update stock item:', await response.json());
            return;
        }

        // Update state immediately for a smoother UI experience
        setItems((prevItems) =>
            prevItems.map((item) => (item.id === id ? { ...item, level } : item))
        );

        // Move to the next item
        setCurrentIndex((prevIndex) => prevIndex + 1);
    };

    if (loading) return <p>Loading stock items...</p>;
    if (items.length === 0) return <p>No stock items found!</p>;
    if (currentIndex >= items.length) return <p>All items updated!</p>;

    const currentItem = items[currentIndex];

    return (
        <div>
            <h2>Stock Wizard</h2>
            <p>Item: {currentItem.name}</p>
            <button onClick={() => updateStockLevel(currentItem.id, 'Low')}>Low</button>
            <button onClick={() => updateStockLevel(currentItem.id, 'Medium')}>Medium</button>
            <button onClick={() => updateStockLevel(currentItem.id, 'High')}>High</button>
        </div>
    );
};

export default StockWizard;
