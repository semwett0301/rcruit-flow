import React, { forwardRef, useImperativeHandle } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Input } from 'ui/Input';
import { FormCol, FormRow, Section, SectionTitle } from 'ui/FormElements';
import { Textarea } from 'ui/Textarea';

export type JobDescriptionFormHandles = {
  submitForm: () => void;
};

export type JobDescriptionFormState = {
  contactName: string;
  jobDescriptionText?: string;
};

interface JobDescriptionFormProps {
  defaultValues?: Partial<JobDescriptionFormState>;
  onSubmit: SubmitHandler<JobDescriptionFormState>;
}

export const jobDescriptionFormDefaultValues: JobDescriptionFormState = {
  contactName: '',
};

export const JobDescriptionForm = forwardRef<
  JobDescriptionFormHandles,
  JobDescriptionFormProps
>(({ defaultValues, onSubmit }, ref) => {
  const { control, handleSubmit } = useForm<JobDescriptionFormState>({
    defaultValues: {
      ...jobDescriptionFormDefaultValues,
      ...defaultValues,
    },
  });

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
          <FormCol>
            <Controller
              name="jobDescriptionText"
              control={control}
              render={({ field, fieldState }) => (
                <Textarea
                  {...field}
                  placeholder="Enter the job description..."
                  error={fieldState.error?.message}
                />
              )}
            />
          </FormCol>
        </FormRow>
      </Section>
    </form>
  );
});

JobDescriptionForm.displayName = 'JobDescriptionForm';
