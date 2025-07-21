import { PropsWithChildren } from 'react';
import styled from 'styled-components';

const ContentContainerDiv = styled.main`
  width: 100%;
  height: 100%;

  padding: ${({ theme }) => theme.spacing.l};
`;

export const ContentContainer = ({ children }: PropsWithChildren) => {
  return <ContentContainerDiv>{children}</ContentContainerDiv>;
};
