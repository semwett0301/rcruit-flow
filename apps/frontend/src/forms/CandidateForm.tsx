import React, { forwardRef, useImperativeHandle } from 'react';
import styled, { css } from 'styled-components';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Input } from 'ui/Input';
import { Checkbox } from 'ui/Checkbox';
import { extractFontPreset } from 'theme/utils/extractFontPreset';
import { Select } from 'ui/Select';
import {
  Degree,
  DegreeLevel,
  SalaryPeriod,
  WEEK_HOURS,
  WeekHours,
} from '@repo/dto';
import { Textarea } from 'ui/Textarea';
import { Switch } from 'ui/Switch';
import { SwitchOption } from 'types/ui/SwitchOption';

export type CandidateFormHandles = {
  submitForm: () => void;
};

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
  degree?: Partial<Degree>;
  targetRole: string;
  ambitions?: string;
  salaryPeriod: SalaryPeriod;
  grossSalary: number;
  hoursAWeek: WeekHours;
};

interface CandidateFormProps {
  defaultValues?: Partial<CandidateFormState>;
  onSubmit: SubmitHandler<CandidateFormState>;
}

interface FormColProps {
  $width?: number;
  $gap?: number;
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

export const FormCol = styled.div<FormColProps>`
  display: flex;
  flex-direction: column;

  ${({ $width }) =>
    $width !== undefined
      ? css`
          flex: 0 0 auto;
          width: min(${$width}px, 100%);
        `
      : css`
          flex: 1 1 0;
          width: 100%;
        `};

  ${({ $gap }) =>
    !!$gap &&
    css`
      gap: ${$gap}px;
    `}
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
  yearsOfExperience: 0,
  degree: undefined,
  targetRole: '',
  salaryPeriod: SalaryPeriod.YEAR,
  grossSalary: 0,
  hoursAWeek: 8,
};

const salaryPeriodValues = Object.values(SalaryPeriod);

if (salaryPeriodValues.length !== 2) {
  throw new Error(
    `Expected exactly 2 SalaryPeriod values, got ${salaryPeriodValues.length}`,
  );
}

const salarySwitchOptions = salaryPeriodValues.map((el) => ({
  label: el,
  value: el,
})) as [SwitchOption, SwitchOption];

export const CandidateForm = forwardRef<
  CandidateFormHandles,
  CandidateFormProps
>(({ defaultValues, onSubmit }, ref) => {
  const { control, handleSubmit, watch } = useForm<CandidateFormState>({
    defaultValues: {
      ...candidateFormDefaultValues,
      ...defaultValues,
    },
  });

  const unemployed = watch('unemployed');
  const ungraduated = watch('ungraduated');

  useImperativeHandle(ref, () => ({
    submitForm: handleSubmit(onSubmit),
  }));

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
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
                min: {
                  value: 1,
                  message: "Age can't be less than 1",
                },
              }}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  type="number"
                  min={1}
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
              render={({ field: { onChange, value } }) => (
                <Checkbox
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
            render={({ field: { onChange, value } }) => (
              <Checkbox
                checked={value}
                onCheck={onChange}
                label="Ungraduated"
              />
            )}
          />
        </FormRow>
        <FormRow>
          <Controller
            name="degree.level"
            control={control}
            rules={{
              required: {
                value: !ungraduated,
                message: 'Select degree level',
              },
            }}
            render={({ field: { value, onChange }, fieldState }) => {
              return (
                <FormCol $width={200}>
                  <Select<DegreeLevel>
                    selectedValues={value ? [value] : []}
                    onSelect={(selectedValue) => {
                      onChange(selectedValue[0]);
                    }}
                    options={Object.values(DegreeLevel).map((el) => ({
                      label: el,
                      value: el,
                    }))}
                    error={fieldState.error?.message}
                    disabled={ungraduated}
                  />
                </FormCol>
              );
            }}
          />
          <Controller
            name="degree.program"
            control={control}
            rules={{
              required: {
                value: !ungraduated,
                message: 'Name of the program is required',
              },
            }}
            render={({ field, fieldState }) => {
              return (
                <FormCol>
                  <Input
                    {...field}
                    error={fieldState.error?.message}
                    placeholder="Name of the program"
                    disabled={ungraduated}
                  />
                </FormCol>
              );
            }}
          />
        </FormRow>
      </Section>
      <Section>
        <SectionTitle>Target role*</SectionTitle>
        <Controller
          name="targetRole"
          control={control}
          rules={{
            required: 'Target role is required',
          }}
          render={({ field, fieldState }) => {
            return (
              <>
                <FormRow>
                  <FormCol>
                    <Input
                      error={fieldState.error?.message}
                      {...field}
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
        <SectionTitle>Salary Information</SectionTitle>
        <FormRow>
          <FormCol $gap={20} $width={170}>
            <Label htmlFor="salaryPeriod">Salary period*</Label>
            <Controller
              name="salaryPeriod"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Switch
                  value={value}
                  onSwitch={onChange}
                  options={salarySwitchOptions}
                />
              )}
            />
          </FormCol>
          <FormCol>
            <Label htmlFor="grossSalary">Gross salary*</Label>
            <Controller
              name="grossSalary"
              control={control}
              rules={{
                required: 'Gross salary is required',
                min: {
                  value: 0,
                  message: "Gross salary can't be negative",
                },
              }}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  type="number"
                  min={0}
                  placeholder="Gross salary"
                  error={fieldState.error?.message}
                />
              )}
            />
          </FormCol>
          <FormCol>
            <Label htmlFor="grossSalary">Hours per week*</Label>
            <Controller
              name="hoursAWeek"
              control={control}
              rules={{
                required: {
                  value: !ungraduated,
                  message: 'Select degree level',
                },
              }}
              render={({ field: { value, onChange }, fieldState }) => {
                return (
                  <Select<WeekHours>
                    selectedValues={value ? [value] : []}
                    onSelect={(selectedValue) => {
                      onChange(selectedValue[0]);
                    }}
                    options={WEEK_HOURS.map((el) => ({
                      label: `${el}`,
                      value: el,
                    }))}
                    error={fieldState.error?.message}
                  />
                );
              }}
            />
          </FormCol>
        </FormRow>
      </Section>
      <Section>
        <SectionTitle>Ambitions</SectionTitle>
        <Controller
          name="ambitions"
          control={control}
          render={({ field }) => {
            return (
              <>
                <FormRow>
                  <FormCol>
                    <Textarea
                      {...field}
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
});

CandidateForm.displayName = 'CandidateForm';
