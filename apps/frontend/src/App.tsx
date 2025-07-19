import React from 'react';
import AppRouter from './router';

import { ThemeProvider } from 'styled-components';
import { blueTheme } from 'theme/blue-theme';
import { GlobalStyle } from 'theme/global';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={blueTheme}>
      <GlobalStyle />
      <AppRouter />
    </ThemeProvider>
  );
};

export default App;
