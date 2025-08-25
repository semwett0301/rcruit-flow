import React from 'react';
import AppRouter from './router';
import 'react-toastify/dist/ReactToastify.css';

import { useAxiosLoader } from 'hooks/useAxiosLoader';
import { LoadingProvider } from 'providers/LoadingProvider';
import { NavbarContainer } from 'ui/containers/NavbarContainer';
import { Navbar } from 'widgets/Navbar';
import { ContentContainer } from 'ui/containers/ContentContainer';

const App: React.FC = () => {
  const hasRequest = useAxiosLoader();

  return (
    <LoadingProvider active={hasRequest} spinner>
      <NavbarContainer>
        <Navbar />
      </NavbarContainer>
      <ContentContainer>
        <AppRouter />
      </ContentContainer>
    </LoadingProvider>
  );
};

export default App;
