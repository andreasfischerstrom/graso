import React from 'react';
import Card from './Card';

const Dashboard = () => {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
      <Card title="Temperature Outside" content="Fetching data..." />
      <Card title="Temperature Inside" content="Fetching data..." />
      <Card title="Water Levels" content="Fetching data..." />
      <Card title="Ferry Schedule" content="Fetching data..." />
      <Card title="Webcam Feed" content="Coming soon..." />
      <Card title="Stock Levels" content="Fetching data..." />
    </div>
  );
};

export default Dashboard;
