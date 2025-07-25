import React, { forwardRef } from 'react';
import styled, { css } from 'styled-components';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { Input } from 'ui/Input';
import { Checkbox } from 'ui/Checkbox';
import { extractFontPreset } from 'theme/utils/extractFontPreset';

const Section = styled.section`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const SectionTitle = styled.h2`
  ${({ theme }) => extractFontPreset('secondHeading')(theme)};
  color: ${({ theme }) => theme.colors.white};
  margin-bottom: ${({ theme }) => theme.spacing.s};
`;

const Label = styled.label`
  display: block;

  margin-bottom: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.white};
  ${({ theme }) => extractFontPreset('regularBold')(theme)};
`;

const FormRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.s};
  margin-bottom: ${({ theme }) => theme.spacing.s};
`;

const FormCol = styled.div<{ $width?: number }>`
  ${({ $width }) =>
    $width
      ? css`
          width: min(${$width}px, 50%);
        `
      : css`
          flex: 1;
        `};
`;

export type CandidateFormState = {
  candidateName: string;
  age: number;
  location: string;
  unemployed: boolean;
  currentEmployer?: string;
  currentPosition?: string;
  experienceDescription: string;
  yearsOfExperience: number;
};

interface CandidateFormProps {
  defaultValues?: Partial<CandidateFormState>;
  onSubmit: SubmitHandler<CandidateFormState>;
}

const candidateFormDefaultValues: CandidateFormState = {
  candidateName: '',
  age: 1,
  location: '',
  unemployed: false,
  currentEmployer: '',
  currentPosition: '',
  experienceDescription: '',
  yearsOfExperience: 1,
};

export const CandidateForm = forwardRef<HTMLFormElement, CandidateFormProps>(
  ({ defaultValues, onSubmit }, ref) => {
    const { control, handleSubmit, watch } = useForm<CandidateFormState>({
      defaultValues: {
        ...candidateFormDefaultValues,
        ...defaultValues,
      },
    });

    const unemployed = watch('unemployed');

    return (
      <form ref={ref} onSubmit={handleSubmit(onSubmit)}>
        <Section>
          <SectionTitle>Personal Information</SectionTitle>
          <FormRow>
            <FormCol>
              <Label htmlFor="candidateName">Full Name</Label>
              <Controller
                name="candidateName"
                control={control}
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    placeholder="Full name"
                    error={fieldState.error?.message}
                  />
                )}
              />
            </FormCol>
            <FormCol>
              <Label htmlFor="age">Age</Label>
              <Controller
                name="age"
                control={control}
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    type="number"
                    min={0}
                    placeholder="Age"
                    error={fieldState.error?.message}
                  />
                )}
              />
            </FormCol>
          </FormRow>
          <Label htmlFor="location">Placement Location</Label>
          <Controller
            name="location"
            control={control}
            render={({ field, fieldState }) => (
              <Input
                {...field}
                placeholder="ex. London, United Kingdom"
                error={fieldState.error?.message}
              />
            )}
          />
        </Section>
        <Section>
          <SectionTitle>Employment Information</SectionTitle>
          <FormRow>
            <FormCol>
              <Controller
                name="unemployed"
                control={control}
                render={({ field: { onChange, value, ...rest } }) => (
                  <Checkbox
                    {...rest}
                    checked={value}
                    onCheck={onChange}
                    label="Unemployed"
                  />
                )}
              />
            </FormCol>
          </FormRow>
          <FormRow>
            <FormCol>
              <Label htmlFor="currentEmployer">Current employer</Label>
              <Controller
                name="currentEmployer"
                control={control}
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    placeholder="Current employer"
                    error={fieldState.error?.message}
                    disabled={unemployed}
                  />
                )}
              />
            </FormCol>
            <FormCol>
              <Label htmlFor="currentPosition">Current position</Label>
              <Controller
                name="currentPosition"
                control={control}
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    placeholder="Current position"
                    error={fieldState.error?.message}
                    disabled={unemployed}
                  />
                )}
              />
            </FormCol>
          </FormRow>
        </Section>
        <Section>
          <SectionTitle>Work Experience</SectionTitle>
          <FormRow>
            <FormCol>
              <Label htmlFor="experienceDescription">
                Experience description
              </Label>
              <Controller
                name="experienceDescription"
                control={control}
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    placeholder="Experience description"
                    error={fieldState.error?.message}
                  />
                )}
              />
            </FormCol>
            <FormCol $width={120}>
              <Label htmlFor="yearsOfExperience">Years of experience</Label>
              <Controller
                name="yearsOfExperience"
                control={control}
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    type="number"
                    min={0}
                    placeholder="Years"
                    error={fieldState.error?.message}
                  />
                )}
              />
            </FormCol>
          </FormRow>
        </Section>
      </form>
    );
  },
);

CandidateForm.displayName = 'CandidateForm';
