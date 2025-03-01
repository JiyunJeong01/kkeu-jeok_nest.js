import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter } from "react-router-dom";
import App from './App';
import { LoginProvider } from './contexts/LoginContext';
import Header from './partials/Header';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <LoginProvider>
      <BrowserRouter>
        <Header />
        <App />
      </BrowserRouter>
    </LoginProvider>
  </React.StrictMode>
);
