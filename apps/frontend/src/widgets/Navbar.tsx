import React, { useLayoutEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { Button } from 'ui/Button';
import { Switch } from 'ui/Switch';
import { language } from 'constants/language';
import { SwitchOption } from 'types/ui/SwitchOption';
import LogoIcon from 'assets/images/logo.svg?component';
import { SquaredButton } from 'ui/SquareButton';
import {
  AvatarIcon,
  ChevronLeftIcon,
  EnvelopeOpenIcon,
  FileIcon,
} from '@radix-ui/react-icons';
import { extractFontPreset } from 'theme/utils/extractFontPreset';
import { show } from '@ebay/nice-modal-react';
import { SimpleModal } from 'modals/SimpleModal';
import { AuthBodyModal } from 'modals/body/AuthBodyModal';

type OpenProps = { $isOpen: boolean };

const NavContainer = styled.nav<OpenProps>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  width: 280px;
  height: 100%;

  background-color: color-mix(
    in srgb,
    ${({ theme }) => theme.colors.blackBlue} 60%,
    transparent
  );

  padding: ${({ theme }) => theme.spacing.m};

  transition: width 0.4s allow-discrete;

  ${({ $isOpen }) =>
    !$isOpen &&
    css`
      width: 110px;
    `}
`;

const TopSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 90px;
`;

const LogoRow = styled.div<OpenProps>`
  display: flex;
  justify-content: space-between;
  align-items: center;

  transition:
    flex-direction 0.5s ease,
    gap 0.5s ease;

  flex-direction: ${({ $isOpen }) => ($isOpen ? 'row' : 'column-reverse')};
  gap: ${({ $isOpen, theme }) => ($isOpen ? '0' : theme.spacing.l)};
`;

const ArrowWrapper = styled.div<OpenProps>`
  width: fit-content;
  height: 20px;

  transition: transform 100ms ease;

  transform: ${({ $isOpen }) => ($isOpen ? 'rotate(0deg)' : 'rotate(180deg)')};
`;

const MenuButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const MenuOption = styled.div<{ $isActive?: boolean }>`
  display: flex;
  align-items: center;

  width: 100%;
  height: 40px;

  padding: ${({ theme }) => theme.spacing.xs};

  color: color-mix(
    in srgb,
    ${({ theme }) => theme.colors.lighterBlue} 40%,
    transparent
  );

  border: 1px solid
    color-mix(
      in srgb,
      ${({ theme }) => theme.colors.lighterBlue} 40%,
      transparent
    );
  border-radius: ${({ theme }) => theme.radius.xs};

  background: linear-gradient(
    to bottom,
    rgba(10, 27, 71, 0.6),
    rgba(25, 67, 173, 0.7)
  );

  cursor: pointer;
  user-select: none;

  ${({ $isActive, theme }) =>
    $isActive &&
    css`
      color: ${theme.colors.white};
      border-color: ${theme.colors.lighterBlue};
    `}
`;

const BottomSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const FooterLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const SocialLinks = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const socialInteractiveStyles = css`
  color: ${({ theme }) => theme.colors.lighterBlue};
  text-decoration: underline;
`;

const SocialLink = styled.a`
  color: color-mix(
    in srgb,
    ${({ theme }) => theme.colors.lighterBlue} 40%,
    transparent
  );

  ${({ theme }) => extractFontPreset('regular')(theme)};

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      ${socialInteractiveStyles}
    }
  }

  &:active {
    ${socialInteractiveStyles}
  }
`;

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isContentVisible, setIsContentVisible] = useState(true);

  const openProfileModal = () => {
    show(SimpleModal, {
      body: <AuthBodyModal />,
    });
  };

  useLayoutEffect(() => {
    let timeout: NodeJS.Timeout;

    if (isOpen) {
      setIsContentVisible(false);
      timeout = setTimeout(() => setIsContentVisible(true), 400);
    }

    return () => clearTimeout(timeout);
  }, [isOpen]);

  const changeOpenness = () => {
    setIsOpen(!isOpen);
  };

  return (
    <NavContainer $isOpen={isOpen}>
      <TopSection>
        <LogoRow $isOpen={isOpen}>
          <LogoIcon />
          <SquaredButton onClick={changeOpenness} size="s" variant="outline">
            <ArrowWrapper $isOpen={isOpen}>
              <ChevronLeftIcon height={20} width={20} />
            </ArrowWrapper>
          </SquaredButton>
        </LogoRow>
        {isContentVisible && (
          <MenuButtons>
            {isOpen ? (
              <>
                <MenuOption $isActive>Introduction Email</MenuOption>
                <MenuOption>Interview Preparation</MenuOption>
              </>
            ) : (
              <>
                <SquaredButton variant="outline" size="s">
                  <EnvelopeOpenIcon width={20} height={20} />
                </SquaredButton>
                <SquaredButton variant="outline" size="s">
                  <FileIcon width={20} height={20} />
                </SquaredButton>
              </>
            )}
          </MenuButtons>
        )}
      </TopSection>

      {isContentVisible && isOpen && (
        <BottomSection>
          <Button onClick={openProfileModal} variant="outline">
            <AvatarIcon width={20} height={20} />
            <div>Profile</div>
          </Button>
          <Switch
            options={
              language.map((lang) => ({ value: lang, label: lang })) as [
                SwitchOption,
                SwitchOption,
              ]
            }
          />
          <FooterLinks>
            <SocialLink href="#">User Agreement</SocialLink>
            <SocialLink href="#">Terms & Conditions</SocialLink>
            <SocialLinks>
              <SocialLink href="#">LinkedIn</SocialLink>
              <SocialLink href="#">Instagram</SocialLink>
              <SocialLink href="#">Facebook</SocialLink>
            </SocialLinks>
          </FooterLinks>
        </BottomSection>
      )}
    </NavContainer>
  );
};
