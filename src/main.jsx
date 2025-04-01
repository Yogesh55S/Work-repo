import React from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';
import App from './App.jsx';
import { AuthProvider } from './Component/providers/AuthContext.jsx';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error(
    "Root element not found. Ensure there is a <div id='root'></div> in your index.html."
  );
}

const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
