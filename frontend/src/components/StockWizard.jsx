import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const StockWizard = () => {
    const [items, setItems] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // Initialize navigation hook

    useEffect(() => {
        const fetchStock = async () => {
            try {
                console.log('Fetching stock items from /api/stock...');
                const response = await fetch('/api/stock');

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                console.log('Fetched stock items:', data);

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
        console.log(`Updating stock item ${id} to ${level}`);

        const response = await fetch('/api/stock', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, level }),
        });

        if (!response.ok) {
            console.error('Failed to update stock item:', await response.json());
            return;
        }

        console.log(`Stock item ${id} updated successfully!`);

        // Update local state immediately
        setItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id ? { ...item, level } : item
            )
        );

        // Move to the next item
        setCurrentIndex((prevIndex) => prevIndex + 1);
    };

    if (loading) return <p>Loading stock items...</p>;
    if (items.length === 0) return <p>No stock items found!</p>;
    
    if (currentIndex >= items.length) {
        return (
            <div>
                <p>All items updated!</p>
                {/* Button navigates back to the Dashboard */}
                <button onClick={() => navigate('/')}>Go to Dashboard</button>
            </div>
        );
    }

    const currentItem = items[currentIndex];

    return (
        <div>
            <h2>Stock Wizard</h2>
            <p><strong>Item:</strong> {currentItem.name}</p>
            <p><strong>Current Stock Level:</strong> {currentItem.level}</p> {/* Show current level */}
            <div>
                <button onClick={() => updateStockLevel(currentItem.id, 'Low')}>Low</button>
                <button onClick={() => updateStockLevel(currentItem.id, 'Medium')}>Medium</button>
                <button onClick={() => updateStockLevel(currentItem.id, 'High')}>High</button>
            </div>
        </div>
    );
};

export default StockWizard;
