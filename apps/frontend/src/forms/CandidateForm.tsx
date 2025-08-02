import React, { forwardRef } from 'react';
import styled, { css } from 'styled-components';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Input } from 'ui/Input';
import { Checkbox } from 'ui/Checkbox';
import { extractFontPreset } from 'theme/utils/extractFontPreset';
import { Select } from 'ui/Select';
import { Degree, DegreeLevel } from '@repo/dto';
import { Textarea } from 'ui/Textarea';

export type CandidateFormState = {
  candidateName: string;
  age: number;
  location: string;
  unemployed: boolean;
  ungraduated: boolean;
  currentEmployer?: string;
  currentPosition?: string;
  experienceDescription: string;
  yearsOfExperience: number;
  degree?: Degree;
  targetRole: string;
  ambitions?: string;
};

interface CandidateFormProps {
  defaultValues?: Partial<CandidateFormState>;
  onSubmit: SubmitHandler<CandidateFormState>;
}

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
          width: min(${$width}px, 100%);
        `
      : css`
          flex: 1;
        `};
`;

export const candidateFormDefaultValues: CandidateFormState = {
  candidateName: '',
  age: 1,
  location: '',
  unemployed: false,
  ungraduated: false,
  currentEmployer: '',
  currentPosition: '',
  experienceDescription: '',
  yearsOfExperience: 1,
  degree: undefined,
  targetRole: '',
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
    const ungraduated = watch('ungraduated');

    return (
      <form ref={ref} onSubmit={handleSubmit(onSubmit)}>
        <Section>
          <SectionTitle>Personal Information</SectionTitle>
          <FormRow>
            <FormCol>
              <Label htmlFor="candidateName">Full Name*</Label>
              <Controller
                name="candidateName"
                control={control}
                rules={{
                  required: 'Full name is required',
                }}
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
              <Label htmlFor="age">Age*</Label>
              <Controller
                name="age"
                control={control}
                rules={{
                  required: 'Age is required',
                }}
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
          <Label htmlFor="location">Location*</Label>
          <Controller
            name="location"
            control={control}
            rules={{
              required: 'Location is required',
            }}
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
              <Label htmlFor="currentEmployer">Current employer*</Label>
              <Controller
                name="currentEmployer"
                control={control}
                rules={{
                  required: {
                    value: !unemployed,
                    message: 'Current employer is required',
                  },
                }}
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
              <Label htmlFor="currentPosition">Current position*</Label>
              <Controller
                name="currentPosition"
                control={control}
                rules={{
                  required: {
                    value: !unemployed,
                    message: 'Current position is required',
                  },
                }}
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
                Experience description*
              </Label>
              <Controller
                name="experienceDescription"
                control={control}
                rules={{
                  required: 'Experience description is required',
                }}
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    placeholder="Experience description"
                    error={fieldState.error?.message}
                  />
                )}
              />
            </FormCol>
            <FormCol $width={130}>
              <Label htmlFor="yearsOfExperience">Years of experience*</Label>
              <Controller
                name="yearsOfExperience"
                control={control}
                rules={{
                  required: 'Number of years is required',
                  min: {
                    value: 0,
                    message: "Year of experience can't be negative",
                  },
                }}
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
        <Section>
          <SectionTitle>Education Information*</SectionTitle>
          <FormRow>
            <Controller
              name="ungraduated"
              control={control}
              rules={{
                required: {
                  value: !ungraduated,
                  message: 'Select degree level',
                },
              }}
              render={({ field: { onChange, value, ...rest } }) => (
                <Checkbox
                  {...rest}
                  checked={value}
                  onCheck={onChange}
                  label="Ungraduated"
                />
              )}
            />
          </FormRow>
          <Controller
            name="degree"
            control={control}
            rules={{
              required: {
                value: !ungraduated,
                message: 'Name of the program is required',
              },
            }}
            render={({ field: { value, onChange } }) => {
              return (
                <>
                  <FormRow>
                    <FormCol $width={200}>
                      <Select
                        selectedValues={value?.level ? [value.level] : []}
                        onSelect={(selectedValue) => {
                          onChange({
                            ...value,
                            level: selectedValue[0],
                          });
                        }}
                        options={Object.values(DegreeLevel).map((el) => ({
                          label: el,
                          value: el,
                        }))}
                        disabled={ungraduated}
                      />
                    </FormCol>
                    <FormCol>
                      <Input
                        value={value?.program}
                        onChange={(e) => {
                          onChange({
                            ...value,
                            program: e.target.value,
                          });
                        }}
                        placeholder="Name of the program"
                        disabled={ungraduated}
                      />
                    </FormCol>
                  </FormRow>
                </>
              );
            }}
          />
        </Section>
        <Section>
          <SectionTitle>Target role*</SectionTitle>
          <Controller
            name="targetRole"
            control={control}
            render={({ field: { value, onChange } }) => {
              return (
                <>
                  <FormRow>
                    <FormCol>
                      <Input
                        value={value}
                        onChange={onChange}
                        placeholder="Target role"
                      />
                    </FormCol>
                  </FormRow>
                </>
              );
            }}
          />
        </Section>
        <Section>
          <SectionTitle>Ambitions</SectionTitle>
          <Controller
            name="ambitions"
            control={control}
            render={({ field: { value, onChange } }) => {
              return (
                <>
                  <FormRow>
                    <FormCol>
                      <Textarea
                        value={value}
                        onChange={onChange}
                        placeholder="The candidate's career ambitions..."
                      />
                    </FormCol>
                  </FormRow>
                </>
              );
            }}
          />
        </Section>
      </form>
    );
  },
);

CandidateForm.displayName = 'CandidateForm';
