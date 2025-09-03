import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './styles.css';
import ScrollProgress from './components/ScrollProgress.jsx';
import ToastContainer from './components/Toast.jsx';
import BackToTop from './components/BackToTop.jsx';
import RippleProvider from './components/RippleProvider.jsx';
import MobileTabBar from './components/MobileTabBar.jsx';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ScrollProgress />
      <ToastContainer />
      <BackToTop />
      <RippleProvider />
      <MobileTabBar />
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
