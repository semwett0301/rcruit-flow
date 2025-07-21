import React from 'react';
import AppRouter from './router';
import 'react-toastify/dist/ReactToastify.css';

import { useAxiosLoader } from 'hooks/useAxiosLoader';
import { LoadingWrapper } from 'containers/LoadingContainer';
import { NavbarContainer } from 'containers/NavbarContainer';
import { Navbar } from 'widgets/Navbar';
import { ContentContainer } from 'containers/ContentContainer';

const App: React.FC = () => {
  const hasRequest = useAxiosLoader();

  return (
    <LoadingWrapper active={hasRequest} spinner>
      <NavbarContainer>
        <Navbar />
      </NavbarContainer>
      <ContentContainer>
        <AppRouter />
      </ContentContainer>
    </LoadingWrapper>
  );
};

export default App;
