import React from 'react';
import styled from 'styled-components';
import { Cat404 } from '@404pagez/react';

const NotFoundWrapper = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
`;

export const NotFoundPage: React.FC = () => {
  return (
    <NotFoundWrapper>
      <Cat404 size={50} isButton={false} />
    </NotFoundWrapper>
  );
};
