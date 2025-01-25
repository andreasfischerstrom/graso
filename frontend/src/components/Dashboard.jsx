import React, { useEffect, useState } from 'react';
import Card from './Card';

const Dashboard = () => {
  const [outsideTemp, setOutsideTemp] = useState(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
      <Card
        title="Temperature Outside"
        content={
          loading
            ? 'Fetching data...'
            : `${outsideTemp}°C`
        }
      />
      <Card title="Temperature Inside" content="Fetching data..." />
      <Card title="Water Levels" content="Fetching data..." />
      <Card title="Ferry Schedule" content="Fetching data..." />
      <Card title="Webcam Feed" content="Coming soon..." />
      <Card title="Stock Levels" content="Fetching data..." />
    </div>
  );
};

export default Dashboard;
