import { PropsWithChildren } from 'react';
import styled from 'styled-components';

const NavbarContainerDiv = styled.aside`
  width: fit-content;
  height: 100%;
`;

export const NavbarContainer = ({ children }: PropsWithChildren) => {
  return <NavbarContainerDiv>{children}</NavbarContainerDiv>;
};
