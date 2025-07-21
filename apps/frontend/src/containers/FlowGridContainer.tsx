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

  max-width: 100%;
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

  min-height: 100%;
`;

const BottomBar = styled.div`
  grid-row: 3;
  grid-column: 2;
`;

const GradientBorder = styled.div`
  width: 100%;
  height: 100%;

  padding: 1px;

  border-radius: ${({ theme }) => theme.radius.s};
  background: linear-gradient(
    to bottom,
    rgba(221, 226, 235, 0.4),
    rgba(21, 87, 255, 0.4)
  );
`;

const MainContentWrapper = styled.div`
  width: 100%;
  height: 100%;

  max-height: 100%;
  max-width: 100%;

  padding: ${({ theme }) => theme.spacing.m};

  border-radius: ${({ theme }) => theme.radius.s};

  overflow-y: scroll;
  overflow-x: hidden;

  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }

  background: linear-gradient(
    to bottom,
    rgba(28, 37, 62, 1),
    rgba(7, 16, 35, 1)
  );
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
      <MainContent>
        <GradientBorder>
          <MainContentWrapper>{MainComponent}</MainContentWrapper>
        </GradientBorder>
      </MainContent>
      <BottomBar>{BottomComponent}</BottomBar>
    </GridContainer>
  );
};
