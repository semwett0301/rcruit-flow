import React from 'react';
import styled from 'styled-components';

interface SeparatorProps {
  className?: string;
  margin?: string;
}

const StyledSeparator = styled.hr<{ $margin: string }>`
  border: none;
  height: 1px;
  background-color: rgba(221, 226, 235, 0.4);
  margin: ${({ $margin }) => $margin};
  width: 100%;
`;

export const Separator: React.FC<SeparatorProps> = ({
  className,
  margin = '25px 0',
}) => <StyledSeparator className={className} $margin={margin} />;
