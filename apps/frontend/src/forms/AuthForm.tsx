import React, { forwardRef, useEffect, useImperativeHandle } from 'react';
import styled, { css } from 'styled-components';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Input } from 'ui/components/Input';
import { Button } from 'ui/components/Button';

export type AuthFormHandles = {
  submitForm: () => void;
};

export type AuthFormState = {
  name: string;
  email: string;
};

interface AuthFormProps {
  values?: AuthFormState;
  onSubmit: SubmitHandler<AuthFormState>;
}

export const authFormDefaultValues: AuthFormState = {
  name: '',
  email: '',
};

// --- containers ---
const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;

  ${({ theme }) => css`
    gap: ${theme.spacing.s};
  `}
`;

const FieldsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  ${({ theme }) => css`
    gap: ${theme.spacing.s};
  `}
`;

// --- form component ---
export const AuthForm = forwardRef<AuthFormHandles, AuthFormProps>(
  ({ values, onSubmit }, ref) => {
    const { control, handleSubmit, setValue } = useForm<AuthFormState>({
      defaultValues: authFormDefaultValues,
    });

    useEffect(() => {
      if (values) {
        const { name, email } = values;

        setValue('name', name);
        setValue('email', email);
      }
    }, [JSON.stringify(values)]);

    useImperativeHandle(ref, () => ({
      submitForm: handleSubmit(onSubmit),
    }));

    return (
      <FormContainer noValidate onSubmit={handleSubmit(onSubmit)}>
        <FieldsContainer>
          <Controller
            name="name"
            control={control}
            rules={{ required: 'Name is required' }}
            render={({ field, fieldState }) => (
              <Input
                {...field}
                placeholder="Name*"
                error={fieldState.error?.message}
              />
            )}
          />

          <Controller
            name="email"
            control={control}
            rules={{
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Enter a valid email address',
              },
            }}
            render={({ field, fieldState }) => (
              <Input
                {...field}
                type="email"
                placeholder="Email*"
                error={fieldState.error?.message}
              />
            )}
          />
        </FieldsContainer>

        <Button type="submit" fullWidth>
          Submit
        </Button>
      </FormContainer>
    );
  },
);

AuthForm.displayName = 'AuthForm';
