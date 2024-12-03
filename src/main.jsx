import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './Component/providers/AuthContext.jsx'; // Import AuthProvider
// import CartContext from './context/CartContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider> {/* Wrap the App with AuthProvider */}
    
      <App />
      
    </AuthProvider>
  </StrictMode>
);
