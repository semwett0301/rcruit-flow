import React from 'react';
import AppRouter from './router';
import 'react-toastify/dist/ReactToastify.css';

import { useAxiosLoader } from 'hooks/useAxiosLoader';
import { LoadingWrapper } from 'containers/LoadingContainer';

const App: React.FC = () => {
  const hasRequest = useAxiosLoader();

  return (
    <LoadingWrapper active={hasRequest} spinner>
      <AppRouter />
    </LoadingWrapper>
  );
};

export default App;
