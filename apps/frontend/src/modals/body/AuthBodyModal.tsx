import styled, { css } from 'styled-components';
import { extractFontPreset } from 'theme/utils/extractFontPreset';
import { AuthForm, AuthFormState } from 'forms/AuthForm';
import { useAuth } from 'hooks/useAuth';
import { useEffect, useState } from 'react';
import { remove } from '@ebay/nice-modal-react';
import { SimpleModal } from 'modals/SimpleModal';
import { useI18n } from 'hooks/useI18n';

const BodyModal = styled.div`
  display: flex;
  flex-direction: column;

  width: 340px;

  gap: ${({ theme }) => theme.spacing.m};
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  ${({ theme }) => css`
    gap: ${theme.spacing.xs};

    padding: 0 ${theme.spacing.s};

    color: ${theme.colors.white};
  `}
`;

const AuthHeader = styled.h1`
  ${({ theme }) => extractFontPreset('firstHeading')(theme)}
`;

const AuthText = styled.p`
  text-align: center;
  ${({ theme }) => extractFontPreset('regular')(theme)}
`;

export const AuthBodyModal = () => {
  const { getUser, registerUser } = useAuth();
  const [user, setUser] = useState<AuthFormState>();
  const { t } = useI18n();

  const onSubmit = async (newUserData: AuthFormState) => {
    await registerUser(newUserData);

    remove(SimpleModal);
  };

  useEffect(() => {
    setUser(getUser());
  }, []);

  return (
    <BodyModal>
      <TitleContainer>
        <AuthHeader>{t('forms.auth.title')}</AuthHeader>
        <AuthText>{t('forms.auth.description')}</AuthText>
      </TitleContainer>
      <AuthForm values={user} onSubmit={onSubmit} />
    </BodyModal>
  );
};
