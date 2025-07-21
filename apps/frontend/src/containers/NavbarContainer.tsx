import { PropsWithChildren } from 'react';
import styled from 'styled-components';

const NavbarContainerDiv = styled.aside`
  position: absolute;
  top: 0;
  left: 0;

  width: fit-content;
  height: 100%;
`;

export const NavbarContainer = ({ children }: PropsWithChildren) => {
  return <NavbarContainerDiv>{children}</NavbarContainerDiv>;
};
