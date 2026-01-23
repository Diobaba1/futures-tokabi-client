import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/globals.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Suppress errors from browser extensions (MetaMask, etc.) in development
if (process.env.NODE_ENV === 'development') {
  const originalError = console.error;
  console.error = (...args) => {
    // Filter out MetaMask and other extension-related errors
    const errorString = args.join(' ');
    if (
      errorString.includes('chrome-extension://') ||
      errorString.includes('MetaMask') ||
      errorString.includes('inpage.js')
    ) {
      return; // Suppress extension errors
    }
    originalError.apply(console, args);
  };

  // Also handle unhandled promise rejections from extensions
  window.addEventListener('unhandledrejection', (event) => {
    if (
      event.reason?.message?.includes('MetaMask') ||
      event.reason?.stack?.includes('chrome-extension://')
    ) {
      event.preventDefault(); // Suppress extension errors
    }
  });
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
