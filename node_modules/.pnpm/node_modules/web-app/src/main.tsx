import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { MediaProvider } from 'media-react';

// You would typically get this from an env variable.
// I'll provide a placeholder or empty string that the user can replace.
const API_KEY = import.meta.env.VITE_PEXELS_API_KEY || 'PLACEHOLDER_API_KEY';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MediaProvider config={{ apiKey: API_KEY }}>
      <App />
    </MediaProvider>
  </React.StrictMode>
);
