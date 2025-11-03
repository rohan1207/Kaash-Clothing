import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { CartProvider } from './context/CartContext.jsx';
import { WishlistProvider } from './context/WishlistContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { LanguageProvider } from './context/LanguageContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <App />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </LanguageProvider>
  </StrictMode>,
)
