import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Enforce Light Theme only globally
document.documentElement.classList.remove('dark');
localStorage.setItem('theme', 'light');

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find the root element in the DOM.');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
