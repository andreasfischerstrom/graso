import React, { useEffect, useState } from 'react';
import Card from './Card';

const Dashboard = () => {
  const [outsideTemp, setOutsideTemp] = useState(null);
  const [loading, setLoading] = useState(true);

  const [stockItems, setStockItems] = useState([]);
  const [loadingStock, setLoadingStock] = useState(true);
  const [errorStock, setErrorStock] = useState(null);

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

  // Fetch stock items for the "Stock Levels" card
  useEffect(() => {
    const fetchStockItems = async () => {
      try {
        const response = await fetch('/api/stock'); // API endpoint for stock data
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setStockItems(data);
      } catch (error) {
        console.error('Error fetching stock data:', error);
        setErrorStock('Failed to fetch stock data.');
      } finally {
        setLoadingStock(false);
      }
    };

    fetchStockItems();
  }, []);

  // Group stock items by their stock level
  const groupedItems = stockItems.reduce((acc, item) => {
    const { level } = item;
    if (!acc[level]) {
      acc[level] = [];
    }
    acc[level].push(item);
    return acc;
  }, {});

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
      <Card
        title="Temperature Outside"
        content={loading ? 'Fetching data...' : `${outsideTemp}°C`}
      />
      <Card title="Temperature Inside" content="Fetching data..." />
      <Card title="Water Levels" content="Fetching data..." />
      <Card title="Ferry Schedule" content="Fetching data..." />
      <Card title="Webcam Feed" content="Coming soon..." />
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
