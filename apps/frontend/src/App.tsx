import React, { useEffect } from 'react';
import AppRouter from './router';
import 'react-toastify/dist/ReactToastify.css';

import styled from 'styled-components';

import LoadingOverlay from 'react-loading-overlay-ts';
import { useAxiosLoader } from 'hooks/useAxiosLoader';
import { useUsersCreate } from 'queries/api/users/usersCreate';

const LoadingWrapper = styled(LoadingOverlay)`
  height: 100%;
  width: 100%;
`;

const App: React.FC = () => {
  const hasRequest = useAxiosLoader();
  const { mutate } = useUsersCreate();

  useEffect(() => {
    console.log('start');
    mutate({
      name: 'Pisa',
      email: 'pisa@gmail.com',
    });
  }, []);

  return (
    <LoadingWrapper active={hasRequest} spinner>
      <AppRouter />
    </LoadingWrapper>
  );
};

export default App;
