import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './styles.css';
import ScrollProgress from './components/ScrollProgress.jsx';
import ToastContainer from './components/Toast.jsx';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ScrollProgress />
      <ToastContainer />
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
