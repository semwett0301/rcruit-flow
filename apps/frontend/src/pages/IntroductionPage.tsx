import React from 'react';
import { FlowGridContainer } from 'containers/FlowGridContainer';
import styled from 'styled-components';
import { extractFontPreset } from 'theme/utils/extractFontPreset';
import { Button } from 'ui/Button';
import { LoopIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import { StepDescription, StepsColumn } from 'widgets/StepsColumn';

const TopBarWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  width: 100%;
`;

const BottomBarWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;

  width: 100%;
`;

const StepName = styled.span`
  ${({ theme }) => extractFontPreset('firstHeading')(theme)}
  color: ${({ theme }) => theme.colors.white}
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

  border-radius: ${({ theme }) => theme.radius.s};

  background: linear-gradient(
    to bottom,
    rgba(28, 37, 62, 1),
    rgba(7, 16, 35, 1)
  );
`;

const steps: StepDescription[] = [
  {
    label: '1',
    current: false,
    disabled: false,
  },
  {
    label: '2',
    current: true,
    disabled: false,
  },
  {
    label: '3',
    current: false,
    disabled: true,
  },
  {
    label: '4',
    current: false,
    disabled: true,
  },
];

export const IntroductionPage = () => {
  return (
    <FlowGridContainer
      BottomComponent={
        <BottomBarWrapper>
          <Button>
            Next step <ChevronRightIcon />
          </Button>
        </BottomBarWrapper>
      }
      TopComponent={
        <TopBarWrapper>
          <StepName>CV upload</StepName>
          <Button variant="outline">
            Reset <LoopIcon />
          </Button>
        </TopBarWrapper>
      }
      LeftComponent={<StepsColumn steps={steps} />}
      MainComponent={
        <GradientBorder>
          <MainContentWrapper />
        </GradientBorder>
      }
    ></FlowGridContainer>
  );
};
