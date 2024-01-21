import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';

// Import createRoot from react-dom/client
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));

root.render(
  <Router>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Router>,
);
