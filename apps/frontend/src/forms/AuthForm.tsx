import React, { forwardRef, useEffect, useImperativeHandle } from 'react';
import styled, { css } from 'styled-components';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Input } from 'ui/components/Input';
import { Button } from 'ui/components/Button';
import { useI18n } from 'hooks/useI18n';

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
    const { t } = useI18n();
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
            rules={{ required: t('forms.auth.fields.name.error') }}
            render={({ field, fieldState }) => (
              <Input
                {...field}
                placeholder={t('forms.auth.fields.name.placeholder')}
                error={fieldState.error?.message}
              />
            )}
          />

          <Controller
            name="email"
            control={control}
            rules={{
              required: t('forms.auth.fields.email.error'),
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: t('forms.auth.fields.email.invalidError'),
              },
            }}
            render={({ field, fieldState }) => (
              <Input
                {...field}
                type="email"
                placeholder={t('forms.auth.fields.email.placeholder')}
                error={fieldState.error?.message}
              />
            )}
          />
        </FieldsContainer>

        <Button type="submit" fullWidth>
          {t('common.buttons.submit')}
        </Button>
      </FormContainer>
    );
  },
);

AuthForm.displayName = 'AuthForm';
