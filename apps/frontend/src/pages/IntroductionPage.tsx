import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { FlowGridContainer } from 'containers/FlowGridContainer';
import styled from 'styled-components';
import { extractFontPreset } from 'theme/utils/extractFontPreset';
import { Button } from 'ui/Button';
import { ChevronRightIcon, LoopIcon } from '@radix-ui/react-icons';
import { StepsColumn } from 'widgets/StepsColumn';
import { CvUploadForm } from 'forms/CvUploadForm';
import { useCvsExtract } from 'queries/api/cvs/cvsExtract';
import {
  CandidateForm,
  candidateFormDefaultValues,
  CandidateFormHandles,
  CandidateFormState,
} from 'forms/CandidateForm';
import {
  JobDescriptionForm,
  JobDescriptionFormHandles,
  JobDescriptionFormState,
} from 'forms/JobDescriptionForm';
import {
  EmailGenerationForm,
  EmailGenerationFormState,
} from 'forms/EmailGenerationForm';
import { useEmailsGenerate } from 'queries/api/emails/emailsGenerate';
import { copyToClipboard } from 'utils/copyToClipboard';
import { useAuth } from 'hooks/useAuth';
import { show } from '@ebay/nice-modal-react';
import { SimpleModal } from 'modals/SimpleModal';
import { ResetBodyModal } from 'modals/body/ResetBodyModal';
import { FileUploadState } from 'ui/FileUpload';
import { AuthBodyModal } from 'modals/body/AuthBodyModal';

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

type StepKey =
  | 'cvUpload'
  | 'candidateInformation'
  | 'jobDescription'
  | 'emailGeneration';

type FlowStepConfig = {
  key: StepKey;
  step: number;
  title: string;
  onNext?: () => void;
  BodyComponent: ReactNode;
  enableNext?: boolean;
};

type GlobalFormState = {
  [key in StepKey]?: object;
};

interface IntroductionFormState extends GlobalFormState {
  cvUpload?: FileUploadState;
  candidateInformation?: CandidateFormState;
  jobDescription?: JobDescriptionFormState;
  emailGeneration?: EmailGenerationFormState;
}

export const IntroductionPage = () => {
  const [currentStep, setCurrentStep] = useState<StepKey>('cvUpload');

  const { getUser } = useAuth();

  const [introductionFormState, setIntroductionFormState] =
    useState<IntroductionFormState>({});

  const { mutate: cvsExtract } = useCvsExtract();

  const { mutate: emailGenerate } = useEmailsGenerate();

  const candidateFormRef = useRef<CandidateFormHandles>(null);
  const jobDescFormRef = useRef<JobDescriptionFormHandles>(null);

  const onReset = useCallback(() => {
    show(SimpleModal, {
      body: (
        <ResetBodyModal
          onReset={() => {
            setIntroductionFormState({});
            setCurrentStep('cvUpload');
          }}
        />
      ),
    });
  }, []);

  const generateEmail = useCallback(
    (formValue: JobDescriptionFormState) => {
      if (introductionFormState.candidateInformation) {
        const candidateInfo = introductionFormState.candidateInformation;

        const { name: recruiterName } = getUser();

        if (!recruiterName) {
          return show(SimpleModal, {
            body: <AuthBodyModal />,
          });
        }

        const jobDescriptionFileId = formValue.jobDescriptionFile?.fileId;
        const finalJobDescription = {
          jobDescriptionFile: jobDescriptionFileId,
          jobDescriptionText: !jobDescriptionFileId
            ? formValue.jobDescriptionText
            : undefined,
        };

        const generateData = {
          ...formValue,
          ...candidateInfo,
          recruiterName,
          focusRoles: candidateInfo.focusRoles.map((el) => el.role),
          ...finalJobDescription,
        };

        if (candidateInfo.unemployed) {
          generateData.currentEmployer = undefined;
          generateData.currentPosition = undefined;
        }

        emailGenerate(generateData, {
          onSuccess: (emailResponse) => {
            setIntroductionFormState({
              ...introductionFormState,
              jobDescription: formValue,
              emailGeneration: {
                message: emailResponse.data.email,
              },
            });

            setCurrentStep('emailGeneration');
          },
        });
      }
    },
    [JSON.stringify(introductionFormState), emailGenerate],
  );

  const flowSteps: [FlowStepConfig, ...FlowStepConfig[]] = [
    {
      key: 'cvUpload',
      step: 1,
      title: 'CV upload',
      onNext: () => {
        const fileId = introductionFormState.cvUpload?.fileId;

        if (fileId) {
          cvsExtract(
            {
              fileId,
            },
            {
              onSuccess: (result) => {
                setIntroductionFormState({
                  ...introductionFormState,
                  candidateInformation: {
                    ...candidateFormDefaultValues,
                    ...introductionFormState.candidateInformation,
                    ...result.data,
                    unemployed:
                      !result.data.currentEmployer ||
                      !result.data.currentPosition,
                  },
                });

                setCurrentStep('candidateInformation');
              },
            },
          );
        } else {
          throw Error('Impossible behaviour');
        }
      },
      BodyComponent: (
        <CvUploadForm
          defaultValue={introductionFormState.cvUpload}
          onSubmit={(state) =>
            state
              ? setIntroductionFormState({
                  ...introductionFormState,
                  cvUpload: state,
                })
              : setIntroductionFormState({})
          }
        />
      ),
    },
    {
      key: 'candidateInformation',
      step: 2,
      title: 'Candidate Information',
      onNext: () => {
        candidateFormRef.current?.submitForm();
      },
      BodyComponent: (
        <CandidateForm
          ref={candidateFormRef}
          defaultValues={introductionFormState.candidateInformation}
          onSubmit={(formValue) => {
            setIntroductionFormState({
              ...introductionFormState,
              candidateInformation: formValue,
            });

            setCurrentStep('jobDescription');
          }}
        />
      ),
      enableNext: true,
    },
    {
      key: 'jobDescription',
      step: 3,
      title: 'Job Description',
      onNext: () => {
        jobDescFormRef.current?.submitForm();
      },
      BodyComponent: (
        <JobDescriptionForm
          ref={jobDescFormRef}
          defaultValues={introductionFormState.jobDescription}
          onSubmit={(formValue) => {
            generateEmail(formValue);
          }}
        />
      ),
      enableNext: true,
    },
    {
      key: 'emailGeneration',
      step: 4,
      title: 'Email Generation',
      BodyComponent: (
        <EmailGenerationForm
          state={introductionFormState.emailGeneration}
          onCopy={copyToClipboard}
          onChange={(message) => {
            setIntroductionFormState({
              ...introductionFormState,
              emailGeneration: {
                message,
              },
            });
          }}
          onGenerate={() => {
            if (introductionFormState.jobDescription) {
              generateEmail(introductionFormState.jobDescription);
            }
          }}
        />
      ),
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
              disabled={
                !introductionFormState[currentConfig.key] &&
                !currentConfig.enableNext
              }
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
          <Button variant="outline" onClick={onReset}>
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
            label: el.step,
          }))}
        />
      }
      MainComponent={currentConfig.BodyComponent}
    ></FlowGridContainer>
  );
};
