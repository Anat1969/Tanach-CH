import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Offline shell only on the root base. Other hosts run without a service worker.
if ('serviceWorker' in navigator && import.meta.env.BASE_URL === '/') {
  navigator.serviceWorker.register('sw.js').catch(() => undefined);
}
