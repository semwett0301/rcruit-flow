import React, { useEffect } from 'react';
import AppRouter from './router';
import 'react-toastify/dist/ReactToastify.css';

import { useAxiosLoader } from 'hooks/useAxiosLoader';
import { LoadingWrapper } from 'containers/LoadingContainer';
import { NavbarContainer } from 'containers/NavbarContainer';
import { Navbar } from 'widgets/Navbar';
import { ContentContainer } from 'containers/ContentContainer';
import { gAnalytics } from 'utils/gAnalytics';

const App: React.FC = () => {
  const hasRequest = useAxiosLoader();

  // Google Analytics initialization
  useEffect(() => {
    const gTag = import.meta.env.VITE_G_TAG;

    if (gTag) gAnalytics.init(gTag);
    else throw new Error('Unable to initialize G-Tag of Google Analytics');
  }, []);

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
