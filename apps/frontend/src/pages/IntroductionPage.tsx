import React, { ReactNode, useState } from 'react';
import { FlowGridContainer } from 'containers/FlowGridContainer';
import styled from 'styled-components';
import { extractFontPreset } from 'theme/utils/extractFontPreset';
import { Button } from 'ui/Button';
import { ChevronRightIcon, LoopIcon } from '@radix-ui/react-icons';
import { StepsColumn } from 'widgets/StepsColumn';
import { CvUploadForm, CvUploadFormState } from 'forms/CvUploadForm';
import { useCvsExtract } from 'queries/api/cvs/cvsExtract';
import { CandidateForm, CandidateFormState } from 'forms/CandidateForm';

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

type StepKey = 1 | 2 | 3 | 4;

type FlowStepConfig = {
  key: StepKey;
  title: string;
  onNext: () => void;
  BodyComponent: ReactNode;
};

type GlobalFormState = {
  [key in StepKey]?: object;
};

interface IntroductionFormState extends GlobalFormState {
  1?: CvUploadFormState;
  2?: CandidateFormState;
}

export const IntroductionPage = () => {
  const [currentStep, setCurrentStep] = useState<StepKey>(1);
  const [introductionFormState, setIntroductionFormState] =
    useState<IntroductionFormState>({});

  const { mutate: cvsExtract } = useCvsExtract();

  const flowSteps: [FlowStepConfig, ...FlowStepConfig[]] = [
    {
      key: 1,
      title: 'CV upload',
      onNext: () => {
        const fileId = introductionFormState[1]?.fileId;

        if (fileId) {
          cvsExtract(
            {
              fileId,
            },
            {
              onSuccess: (result) => {
                setIntroductionFormState({
                  ...introductionFormState,
                  2: {
                    ...introductionFormState[2],
                    ...result.data,
                    unemployed:
                      !result.data.currentEmployer ||
                      !result.data.currentPosition,
                  },
                });

                setCurrentStep(2);
              },
            },
          );
        } else {
          throw Error('Impossible behaviour');
        }
      },
      BodyComponent: (
        <CvUploadForm
          defaultValue={introductionFormState[1]}
          onSubmit={(state) =>
            state
              ? setIntroductionFormState({
                  ...introductionFormState,
                  1: state,
                })
              : setIntroductionFormState({})
          }
        />
      ),
    },
    {
      key: 2,
      title: 'Candidate Information',
      onNext: () => {
        console.log('Proceed to Step 2');
      },
      BodyComponent: (
        <CandidateForm
          defaultValues={introductionFormState[2]}
          onSubmit={() => {}}
        />
      ),
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
  ];

  const currentConfigIdx = flowSteps.findIndex((el) => el.key === currentStep);
  const currentConfig = flowSteps[currentConfigIdx];

  if (!currentConfig) {
    return null;
  }

  return (
    <FlowGridContainer
      BottomComponent={
        <BottomBarWrapper>
          {currentStep !== flowSteps.at(-1)!.key && (
            <Button
              disabled={!introductionFormState[currentConfig.key]}
              onClick={currentConfig.onNext}
            >
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
            disabled: !introductionFormState[el.key] && el.key !== currentStep,
            current: currentStep == el.key,
            label: el.key,
          }))}
        />
      }
      MainComponent={currentConfig.BodyComponent}
    ></FlowGridContainer>
  );
};
