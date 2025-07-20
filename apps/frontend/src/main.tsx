import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { queryClient } from 'queries/queryClient';
import { blueTheme } from 'theme/blue-theme';
import { GlobalStyle } from 'theme/global';
import { ThemeProvider } from 'styled-components';
import { ToastContainer } from 'react-toastify';
import { QueryClientProvider } from '@tanstack/react-query';

import './config/axiosConfig';

const container = document.getElementById('root');

if (container) {
  const root = createRoot(container);

  root.render(
    <ThemeProvider theme={blueTheme}>
      <ToastContainer />
      <GlobalStyle />
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </ThemeProvider>,
  );
}
