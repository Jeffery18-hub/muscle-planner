import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AccountContextProvider } from './contexts/accountContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AccountContextProvider>
    <App />
    </AccountContextProvider>
  </React.StrictMode>
);
