import React, { ReactNode, useState } from 'react';
import { FlowGridContainer } from 'containers/FlowGridContainer';
import styled from 'styled-components';
import { extractFontPreset } from 'theme/utils/extractFontPreset';
import { Button } from 'ui/Button';
import { ChevronRightIcon, LoopIcon } from '@radix-ui/react-icons';
import { StepsColumn } from 'widgets/StepsColumn';

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

type FlowStepConfig = {
  key: number;
  title: string;
  onNext: () => void;
  BodyComponent: ReactNode;
};

export const IntroductionPage = () => {
  const [currentStep, setCurrentStep] =
    useState<(typeof flowSteps)[number]['key']>(1);

  const flowSteps = [
    {
      key: 1,
      title: 'CV upload',
      onNext: () => {},
      BodyComponent: <div />,
    },
    {
      key: 2,
      title: 'Candidate Information',
      onNext: () => {
        console.log('Proceed to Step 2');
      },
      BodyComponent: <div />,
    },
    {
      key: 3,
      title: 'Job Description',
      onNext: () => {
        console.log('Proceed to Step 2');
      },
      BodyComponent: <div />,
    },
    {
      key: 4,
      title: 'Email Generation',
      onNext: () => {
        console.log('Proceed to Step 2');
      },
      BodyComponent: <div />,
    },
  ] as const satisfies readonly [FlowStepConfig, ...FlowStepConfig[]];

  const currentConfigIdx = flowSteps.findIndex((el) => el.key === currentStep);
  const currentConfig = flowSteps[currentConfigIdx] as FlowStepConfig;

  const onNext = () => {
    if (currentConfigIdx + 1 < flowSteps.length) {
      setCurrentStep(flowSteps[currentConfigIdx + 1]!.key);
    }

    currentConfig.onNext();
  };

  return (
    <FlowGridContainer
      BottomComponent={
        <BottomBarWrapper>
          {currentStep !== flowSteps.at(-1)!.key && (
            <Button onClick={onNext}>
              Next step <ChevronRightIcon />
            </Button>
          )}
        </BottomBarWrapper>
      }
      TopComponent={
        <TopBarWrapper>
          <StepName>{currentConfig.title}</StepName>
          <Button variant="outline">
            Reset <LoopIcon />
          </Button>
        </TopBarWrapper>
      }
      LeftComponent={
        <StepsColumn
          steps={flowSteps.map((el) => ({
            onClick: () => {
              setCurrentStep(el.key);
            },
            disabled: currentStep < el.key,
            current: currentStep == el.key,
            label: el.key,
          }))}
        />
      }
      MainComponent={
        <GradientBorder>
          <MainContentWrapper>{currentConfig.BodyComponent}</MainContentWrapper>
        </GradientBorder>
      }
    ></FlowGridContainer>
  );
};
