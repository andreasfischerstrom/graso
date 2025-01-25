console.log('main.jsx loaded');
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log('Mounting App...');
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
console.log('App mounted');
