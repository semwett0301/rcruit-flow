import React from 'react';
import AppRouter from './router';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { ThemeProvider } from 'styled-components';
import { blueTheme } from 'theme/blue-theme';
import { GlobalStyle } from 'theme/global';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={blueTheme}>
      <ToastContainer />
      <GlobalStyle />
      <AppRouter />
    </ThemeProvider>
  );
};

export default App;
