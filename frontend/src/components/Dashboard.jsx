import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Card from './Card';

// Supabase connection
const SUPABASE_URL = 'https://lsubvjnjdgdjvyuokubr.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // Truncated for security
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const Dashboard = () => {
    // Weather state
    const [outsideTemp, setOutsideTemp] = useState(null);
    const [loading, setLoading] = useState(true);

    // Stock data state
    const [stockItems, setStockItems] = useState([]);
    const [loadingStock, setLoadingStock] = useState(true);
    const [errorStock, setErrorStock] = useState(null);

    // Fetch weather data
    useEffect(() => {
        const fetchTemperature = async () => {
            try {
                const apiKey = 'd42250a40b92eb9485dfbeeb34d203e2'; // Replace with your OpenWeather API key
                const lat = 60.3391; // Latitude of Öregrund
                const lon = 18.4363; // Longitude of Öregrund
                const response = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
                );
                const data = await response.json();
                console.log(data);
                setOutsideTemp(data.main.temp);
            } catch (error) {
                console.error('Error fetching weather data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTemperature();
    }, []);

    // Fetch stock data
    useEffect(() => {
        const fetchStockItems = async () => {
            const { data, error } = await supabase.from('stock_items').select('*');
            if (error) {
                setErrorStock('Failed to fetch stock data.');
            } else {
                setStockItems(data);
            }
            setLoadingStock(false);
        };

        fetchStockItems();
    }, []);

    // Group stock items by stock level
    const groupedItems = stockItems.reduce((acc, item) => {
        const { level } = item;
        if (!acc[level]) acc[level] = [];
        acc[level].push(item);
        return acc;
    }, {});

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
            {/* Weather Cards */}
            <Card
                title="Temperature Outside"
                content={loading ? 'Fetching data...' : `${outsideTemp}°C`}
            />
            <Card title="Temperature Inside" content="Fetching data..." />
            <Card title="Water Levels" content="Fetching data..." />
            <Card title="Ferry Schedule" content="Fetching data..." />
            <Card title="Webcam Feed" content="Coming soon..." />

            {/* Stock Levels Card */}
            <Card
                title="Stock Levels"
                content={
                    loadingStock ? (
                        'Fetching data...'
                    ) : errorStock ? (
                        errorStock
                    ) : (
                        <div>
                            {['High', 'Medium', 'Low'].map((level) => (
                                <div key={level} style={{ marginBottom: '8px' }}>
                                    <strong>{level} Stock Level:</strong>
                                    <ul>
                                        {groupedItems[level]?.map((item) => (
                                            <li key={item.id}>{item.name}</li>
                                        )) || <li>No items</li>}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )
                }
            />
        </div>
    );
};

export default Dashboard;
