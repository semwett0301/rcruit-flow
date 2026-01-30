import { ReactNode, useCallback, useRef, useState } from 'react';
import { FlowGridContainer } from 'ui/containers/FlowGridContainer';
import styled from 'styled-components';
import { extractFontPreset } from 'theme/utils/extractFontPreset';
import { Button } from 'ui/components/Button';
import { CTAButton } from '../components/ui/CTAButton';
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
import { FileUploadState } from 'ui/components/FileUpload';
import { AuthBodyModal } from 'modals/body/AuthBodyModal';
import { GtmForm, gtmTracking } from 'utils/gtmTracking';
import { useI18n } from 'hooks/useI18n';

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

const ResetButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.colors.gray500 || '#6b7280'};
  font-size: 0.875rem;
  text-decoration: underline;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.gray700 || '#374151'};
  }
`;

interface IntroductionFormState {
  cv_upload?: FileUploadState;
  candidate_information?: CandidateFormState;
  job_description?: JobDescriptionFormState;
  email_generation?: EmailGenerationFormState;
}

export type IntroMailStepKey = keyof IntroductionFormState;

type FlowStepConfig = {
  key: IntroMailStepKey;
  step: number;
  title: string;
  nextButtonTitle?: string;
  onNext?: () => void;
  BodyComponent: ReactNode;
  enableNext?: boolean;
};

// TODO refactor and decompose the page
export const IntroductionPage = () => {
  const [currentStep, setCurrentStep] = useState<IntroMailStepKey>('cv_upload');
  const { t } = useI18n();

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
            setCurrentStep('cv_upload');

            gtmTracking.trackReset({
              formName: GtmForm.INTRO_MAIL,
            });
          }}
        />
      ),
    });
  }, []);

  const generateEmail = useCallback(
    (formValue: JobDescriptionFormState) => {
      if (introductionFormState.candidate_information) {
        const candidateInfo = introductionFormState.candidate_information;

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
              job_description: formValue,
              email_generation: {
                message: emailResponse.data.email,
              },
            });

            setCurrentStep('email_generation');
          },
        });
      }
    },
    [JSON.stringify(introductionFormState), emailGenerate],
  );

  const flowSteps: [FlowStepConfig, ...FlowStepConfig[]] = [
    {
      key: 'cv_upload',
      step: 1,
      title: t('common.steps.cvUpload'),
      nextButtonTitle: t('forms.cvUpload.button.next'),
      onNext: () => {
        const fileId = introductionFormState.cv_upload?.fileId;

        if (fileId) {
          cvsExtract(
            {
              fileId,
            },
            {
              onSuccess: (result) => {
                setIntroductionFormState({
                  ...introductionFormState,
                  candidate_information: {
                    ...candidateFormDefaultValues,
                    ...introductionFormState.candidate_information,
                    ...result.data,
                    unemployed:
                      !result.data.currentEmployer ||
                      !result.data.currentPosition,
                  },
                });

                setCurrentStep('candidate_information');

                gtmTracking.trackStepSubmitSuccess({
                  formName: GtmForm.INTRO_MAIL,
                  step: 'cv_upload',
                });
              },
            },
          );
        } else {
          throw Error(t('errors.impossibleBehaviour'));
        }
      },
      BodyComponent: (
        <CvUploadForm
          defaultValue={introductionFormState.cv_upload}
          onSubmit={(state) =>
            state
              ? setIntroductionFormState({
                  ...introductionFormState,
                  cv_upload: state,
                })
              : setIntroductionFormState({})
          }
        />
      ),
    },
    {
      key: 'candidate_information',
      step: 2,
      title: t('common.steps.candidateInformation'),
      nextButtonTitle: t('forms.candidate.button.next'),
      onNext: () => {
        candidateFormRef.current?.submitForm();
      },
      BodyComponent: (
        <CandidateForm
          ref={candidateFormRef}
          defaultValues={introductionFormState.candidate_information}
          onSubmit={(formValue) => {
            setIntroductionFormState({
              ...introductionFormState,
              candidate_information: formValue,
            });

            setCurrentStep('job_description');

            gtmTracking.trackStepSubmitSuccess({
              formName: GtmForm.INTRO_MAIL,
              step: 'candidate_information',
            });
          }}
        />
      ),
      enableNext: true,
    },
    {
      key: 'job_description',
      step: 3,
      title: t('common.steps.jobDescription'),
      nextButtonTitle: t('forms.jobDescription.button.next'),
      onNext: () => {
        jobDescFormRef.current?.submitForm();
      },
      BodyComponent: (
        <JobDescriptionForm
          ref={jobDescFormRef}
          defaultValues={introductionFormState.job_description}
          onSubmit={(formValue) => {
            generateEmail(formValue);

            gtmTracking.trackStepSubmitSuccess({
              formName: GtmForm.INTRO_MAIL,
              step: 'job_description',
            });
          }}
        />
      ),
      enableNext: true,
    },
    {
      key: 'email_generation',
      step: 4,
      title: t('common.steps.emailGeneration'),
      BodyComponent: (
        <EmailGenerationForm
          state={introductionFormState.email_generation}
          onCopy={copyToClipboard}
          onChange={(message) => {
            setIntroductionFormState({
              ...introductionFormState,
              email_generation: {
                message,
              },
            });
          }}
          onGenerate={() => {
            if (introductionFormState.job_description) {
              generateEmail(introductionFormState.job_description);

              gtmTracking.trackRegenerate({
                formName: GtmForm.INTRO_MAIL,
              });
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
            <CTAButton
              disabled={
                !introductionFormState[currentConfig.key] &&
                !currentConfig.enableNext
              }
              onClick={currentConfig.onNext}
              ariaLabel={t(currentConfig.nextButtonTitle ?? 'common.buttons.next')}
            >
              {t(currentConfig.nextButtonTitle ?? 'common.buttons.next')}{' '}
              <ChevronRightIcon />
            </CTAButton>
          )}
        </BottomBarWrapper>
      }
      TopComponent={
        <TopBarWrapper>
          <StepName>{currentConfig.title}</StepName>
          {/* Secondary action with subdued styling */}
          <ResetButton onClick={onReset}>
            {t('common.buttons.reset')} <LoopIcon />
          </ResetButton>
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
