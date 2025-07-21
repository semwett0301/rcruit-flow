import React, { ReactNode } from 'react';
import styled from 'styled-components';

interface FlowGridContainerProps {
  LeftComponent: ReactNode;
  MainComponent: ReactNode;
  TopComponent: ReactNode;
  BottomComponent: ReactNode;
}

const GridContainer = styled.div`
  position: relative;

  display: grid;
  grid-template-columns: 60px 1fr;
  grid-template-rows: 35px 1fr 40px;

  column-gap: 60px;
  row-gap: 40px;

  height: 100%;
`;

const StepsColumn = styled.div`
  width: 100%;
  height: 100%;

  grid-row: 2 / 3;
`;

const TopBar = styled.div`
  grid-row: 1;
  grid-column: 2;
`;

const MainContent = styled.div`
  grid-row: 2;
  grid-column: 2;
`;

const BottomBar = styled.div`
  grid-row: 3;
  grid-column: 2;
`;

export const FlowGridContainer = ({
  LeftComponent,
  BottomComponent,
  TopComponent,
  MainComponent,
}: FlowGridContainerProps) => {
  return (
    <GridContainer>
      <StepsColumn>{LeftComponent}</StepsColumn>

      <TopBar>{TopComponent}</TopBar>
      <MainContent>{MainComponent}</MainContent>
      <BottomBar>{BottomComponent}</BottomBar>
    </GridContainer>
  );
};
