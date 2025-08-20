import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Input } from 'ui/Input';
import { FormCol, FormRow, Section, SectionTitle } from 'ui/FormElements';
import { Textarea } from 'ui/Textarea';
import { TextSwitch } from 'ui/TextSwitch';
import { SwitchOption } from 'types/ui/SwitchOption';
import { FileUpload, FileUploadState, useFileUpload } from 'ui/FileUpload';

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

  useImperativeHandle(ref, () => ({
    submitForm: handleSubmit(onSubmit),
  }));

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <Section>
        <SectionTitle>Receiver name*</SectionTitle>
        <FormRow>
          <FormCol>
            <Controller
              name="contactName"
              control={control}
              rules={{
                required: 'Contact name name is required',
              }}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  placeholder="Name of the person you are writing to..."
                  error={fieldState.error?.message}
                />
              )}
            />
          </FormCol>
        </FormRow>
      </Section>
      <Section>
        <SectionTitle>Job description</SectionTitle>
        <FormRow>
          <TextSwitch
            onSwitch={setSwitchValue}
            value={switchValue}
            options={switchOptions}
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
                    placeholder="Enter the job description..."
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
