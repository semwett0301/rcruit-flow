import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Input } from 'ui/components/Input';
import {
  FormCol,
  FormRow,
  Section,
  SectionTitle,
} from 'ui/components/FormElements';
import { Textarea } from 'ui/components/Textarea';
import { TextSwitch } from 'ui/components/TextSwitch';
import { SwitchOption } from 'types/ui/SwitchOption';
import {
  FileUpload,
  FileUploadState,
  useFileUpload,
} from 'ui/components/FileUpload';
import { useI18n } from 'hooks/useI18n';

const heightBody = 315;

export type JobDescriptionFormHandles = {
  submitForm: () => void;
};

export type JobDescriptionFormState = {
  contactName: string;
  jobDescriptionText?: string;
  jobDescriptionFile?: FileUploadState;
};

interface JobDescriptionFormProps {
  defaultValues?: Partial<JobDescriptionFormState>;
  onSubmit: SubmitHandler<JobDescriptionFormState>;
}

const switchOptions: [SwitchOption, SwitchOption] = [
  {
    label: 'Paste text',
    value: 'text',
  },
  {
    label: 'Upload PDF',
    value: 'pdf',
  },
];

export const jobDescriptionFormDefaultValues: JobDescriptionFormState = {
  contactName: '',
};

// TODO Refactor the layout here
export const JobDescriptionForm = forwardRef<
  JobDescriptionFormHandles,
  JobDescriptionFormProps
>(({ defaultValues, onSubmit }, ref) => {
  const { t } = useI18n();
  const { control, handleSubmit, setValue, watch } =
    useForm<JobDescriptionFormState>({
      defaultValues: {
        ...jobDescriptionFormDefaultValues,
        ...defaultValues,
      },
    });

  const jobDescriptionFile = watch('jobDescriptionFile');

  const { uploadState, onFileRemove, onFileSelect } = useFileUpload({
    initialValue: jobDescriptionFile,
    onUploaded: (newValue) => {
      setValue('jobDescriptionFile', newValue ?? undefined);
    },
  });

  const [switchValue, setSwitchValue] = useState<string>(
    switchOptions[0].value,
  );

  const switchOptionsWithTranslation: [SwitchOption, SwitchOption] = [
    {
      label: t('forms.jobDescription.options.pasteText'),
      value: 'text',
    },
    {
      label: t('forms.jobDescription.options.uploadPdf'),
      value: 'pdf',
    },
  ];

  useImperativeHandle(ref, () => ({
    submitForm: handleSubmit(onSubmit),
  }));

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <Section>
        <SectionTitle>
          {t('forms.jobDescription.sections.receiverName')}
        </SectionTitle>
        <FormRow>
          <FormCol>
            <Controller
              name="contactName"
              control={control}
              rules={{
                required: t('forms.jobDescription.fields.contactName.error'),
              }}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  placeholder={t(
                    'forms.jobDescription.fields.contactName.placeholder',
                  )}
                  error={fieldState.error?.message}
                />
              )}
            />
          </FormCol>
        </FormRow>
      </Section>
      <Section>
        <SectionTitle>
          {t('forms.jobDescription.sections.jobDescription')}
        </SectionTitle>
        <FormRow>
          <TextSwitch
            onSwitch={setSwitchValue}
            value={switchValue}
            options={switchOptionsWithTranslation}
          />
        </FormRow>
        <FormRow>
          <FormCol>
            {switchValue === 'text' ? (
              <Controller
                name="jobDescriptionText"
                control={control}
                render={({ field, fieldState }) => (
                  <Textarea
                    {...field}
                    height={`${heightBody}px`}
                    placeholder={t(
                      'forms.jobDescription.fields.jobDescriptionText.placeholder',
                    )}
                    error={fieldState.error?.message}
                  />
                )}
              />
            ) : (
              <div style={{ height: heightBody }}>
                <FileUpload
                  uploadState={uploadState}
                  onFileRemove={onFileRemove}
                  onFileSelect={onFileSelect}
                  defaultFile={jobDescriptionFile?.file}
                />
              </div>
            )}
          </FormCol>
        </FormRow>
      </Section>
    </form>
  );
});

JobDescriptionForm.displayName = 'JobDescriptionForm';
