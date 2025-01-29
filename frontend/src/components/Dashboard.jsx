import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Card from './Card';

// Supabase connection
const SUPABASE_URL = 'https://lsubvjnjdgdjvyuokubr.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzdWJ2am5qZGdkanZ5dW9rdWJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgxMzU3ODQsImV4cCI6MjA1MzcxMTc4NH0.gmA9k4jWm49vcTOYp-YxIsH62nzr7l7zqak77ensYN0'; // Replace with your actual Supabase key
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const Dashboard = () => {
    // Weather state
    const [outsideTemp, setOutsideTemp] = useState(null);
    const [loading, setLoading] = useState(true);

    // Ferry Schedule
    const [ferryData, setFerryData] = useState(null);
    const [loadingFerry, setLoadingFerry] = useState(true);
    const [errorFerry, setErrorFerry] = useState(null);

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
                setLoading(false);
            }
        };

        fetchTemperature();
    }, []);

    useEffect(() => {
        const fetchFerrySchedule = async () => {
            try {
                const response = await fetch('/api/ferry');
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                setFerryData(data);
            } catch (error) {
                console.error('Error fetching ferry schedule:', error);
                setErrorFerry('Failed to fetch ferry schedule');
            } finally {
                setLoadingFerry(false);
            }
        };

        fetchFerrySchedule();
    }, []);

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
            {/* Weather Cards */}
            <Card title="Temperature Outside" content={loading ? 'Fetching data...' : `${outsideTemp}°C`} />
            <Card title="Temperature Inside" content="Fetching data..." />
            <Card title="Water Levels" content="Fetching data..." />
            <Card title="Webcam Feed" content="Coming soon..." />

            {/* Ferry Schedule Card */}
            <Card
                title="Ferry Schedule"
                content={
                    loadingFerry ? (
                        'Fetching data...'
                    ) : errorFerry ? (
                        errorFerry
                    ) : (
                        <table style={{ width: '100%', textAlign: 'left' }}>
                            <thead>
                                <tr>
                                    <th>Time</th>
                                    <th>Departure</th>
                                    <th>Destination</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[...(ferryData?.toOregrund || []), ...(ferryData?.toGraso || [])].map((ferry, index) => (
                                    <tr key={index}>
                                        <td>{new Date(ferry.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                        <td>{ferry.origin}</td>
                                        <td>{ferry.destination}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )
                }
            />
        </div>
    );
};

export default Dashboard;
