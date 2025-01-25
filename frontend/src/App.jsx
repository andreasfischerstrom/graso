import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Stock from './components/Stock';
import Wiki from './components/Wiki';
import StockWizard from './components/StockWizard';

const App = () => {
  return (
    <Router>
      <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
        {/* Sidebar */}
        <div style={{ width: '250px', background: '#1e1e1e', color: 'white', padding: '20px' }}>
          <h2>Gräsö</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '10px' }}>
              <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>
            </li>
            <li style={{ marginBottom: '10px' }}>
              <Link to="/stock" style={{ color: 'white', textDecoration: 'none' }}>Stock</Link>
            </li>
            <li style={{ marginBottom: '10px' }}>
              <Link to="/wiki" style={{ color: 'white', textDecoration: 'none' }}>Wiki</Link>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, padding: '20px', background: '#f0f2f5' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/stock" element={<StockWizard />} />
            <Route path="/wiki" element={<Wiki />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
