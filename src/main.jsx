import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles/global.css';
import './styles/header.css';
import './styles/hero.css';
import './styles/products.css';
import './styles/product-details.css';
import './styles/cart.css';
import './styles/checkout.css';
import './styles/promos.css';
import './styles/articles.css';
import './styles/article-details.css';
import './styles/category-page.css';
import './styles/sale-page.css';
import './styles/about-page.css';
import './styles/contact-page.css';
import './styles/faq-page.css';
import './styles/payment-page.css';
import './styles/login-page.css';
import './styles/account-page.css';
import './styles/admin-dashboard.css';
import './styles/newsletter.css';
import './styles/app-download.css';
import './styles/footer.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
