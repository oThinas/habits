/* eslint-disable function-paren-newline */
import React from 'react';
import ReactDOM from 'react-dom/client';

import { App } from './App';

import { Toaster } from './components/Toaster';
import { ModalContextProvider } from './context/ModalContext';

import './lib/dayjs';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ModalContextProvider>
      <App />

      <Toaster />
    </ModalContextProvider>
  </React.StrictMode>,
);
