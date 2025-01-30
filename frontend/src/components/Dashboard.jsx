import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Card from './Card';
import '../styles/global.css'; // Global styles
import '../styles/dashboard.css'; // New dashboard styles

// Supabase connection
const SUPABASE_URL = 'https://lsubvjnjdgdjvyuokubr.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzdWJ2am5qZGdkanZ5dW9rdWJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgxMzU3ODQsImV4cCI6MjA1MzcxMTc4NH0.gmA9k4jWm49vcTOYp-YxIsH62nzr7l7zqak77ensYN0'; // Replace with your actual Supabase key
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const Dashboard = () => {
    const [outsideTemp, setOutsideTemp] = useState(null);
    const [loadingWeather, setLoadingWeather] = useState(true);
    const [stockItems, setStockItems] = useState([]);
    const [loadingStock, setLoadingStock] = useState(true);
    const [errorStock, setErrorStock] = useState(null);

    useEffect(() => {
        const fetchTemperature = async () => {
            try {
                const apiKey = 'd42250a40b92eb9485dfbeeb34d203e2';
                const lat = 60.3391;
                const lon = 18.4363;
                const response = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
                );
                const data = await response.json();
                setOutsideTemp(data.main.temp);
            } catch (error) {
                console.error('Error fetching weather data:', error);
            } finally {
                setLoadingWeather(false);
            }
        };

        fetchTemperature();
    }, []);

    useEffect(() => {
        const fetchStockItems = async () => {
            const { data, error } = await supabase.from('stock_items').select('*');
            if (error) {
                console.error('Error fetching stock:', error);
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
        <div className="dashboard-container">
            <h1 className="dashboard-title">God eftermiddag</h1>
            <div className="dashboard-grid">
                <Card title="Temperatur" content={loadingWeather ? 'Laddar...' : `+${outsideTemp}°C`} subtitle="Inomhus" />
                <Card title="Temperatur" content="-2°C" subtitle="Utomhus" />
                <Card title="Vattennivå" content="23 cm" subtitle="21 januari" />
                <Card title="Webbkamera" content={<span className="webcam-placeholder">▶</span>} />
                <Card 
                    title="Färjetabell" 
                    content={
                        <table className="ferry-table">
                            <thead>
                                <tr>
                                    <th>Öregrund</th>
                                    <th>Gräsö</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr><td>12:00</td><td>12:07</td></tr>
                                <tr><td>12:30</td><td>12:37</td></tr>
                                <tr><td>13:00</td><td>13:07</td></tr>
                            </tbody>
                        </table>
                    } 
                />
                <Card 
                    title="Lagerstatus"
                    content={
                        <div className="stock-container">
                            <div className="stock-group high">
                                <strong>Finns mycket</strong>
                                <ul>{groupedItems['High']?.map(item => <li key={item.id}>{item.name}</li>) || <li>Inget</li>}</ul>
                            </div>
                            <div className="stock-group medium">
                                <strong>Finns delvis</strong>
                                <ul>{groupedItems['Medium']?.map(item => <li key={item.id}>{item.name}</li>) || <li>Inget</li>}</ul>
                            </div>
                            <div className="stock-group low">
                                <strong>Finns lite</strong>
                                <ul>{groupedItems['Low']?.map(item => <li key={item.id}>{item.name}</li>) || <li>Inget</li>}</ul>
                            </div>
                        </div>
                    }
                />
            </div>
        </div>
    );
};

export default Dashboard;
