import React, {
  PropsWithChildren,
  ReactNode,
  useLayoutEffect,
  useState,
} from 'react';
import styled, { css } from 'styled-components';

export interface TooltipProps {
  content: ReactNode;
}

const TooltipContainer = styled.div`
  position: relative;
  display: inline-block;
`;

interface TooltipBoxProps {
  $visible: boolean;
  $onScreen: boolean;
}

const TooltipBox = styled.div<TooltipBoxProps>`
  position: absolute;

  transition: opacity 0.2s ease;

  min-width: 200px;

  ${({ theme, $visible, $onScreen }) => css`
    opacity: ${$visible ? 1 : 0};

    display: ${$onScreen ? 'block' : 'none'};

    top: ${theme.spacing.l};
    right: -${theme.spacing.xs};

    padding: ${theme.spacing.xs};
    border-radius: ${theme.radius.s};

    background: ${theme.colors.blackBlue};

    border: 1px solid ${theme.colors.lighterBlue};

    z-index: ${theme.zIndex.tooltip};

    -webkit-backdrop-filter: blur(${theme.radius.s});
    backdrop-filter: blur(${theme.radius.s});

    &::before {
      content: '';
      position: absolute;
      top: -${theme.spacing.s};
      right: ${theme.spacing.xs};
      border-width: ${theme.spacing.xs};
      border-style: solid;
      border-color: transparent transparent ${theme.colors.lighterBlue}
        transparent;
    }

    &::after {
      content: '';
      position: absolute;
      top: calc(-${theme.spacing.s} + 4.5px);
      right: calc(${theme.spacing.xs} + 3px);
      border-width: calc(${theme.spacing.xs} - 3px);
      border-style: solid;
      border-color: transparent transparent ${theme.colors.blackBlue}
        transparent;
    }
  `}
`;

const TooltipChildrenWrapper = styled.div``;

export const Tooltip = ({
  children,
  content,
}: PropsWithChildren<TooltipProps>) => {
  const [isOnScreen, setIsOnScreen] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const onMouseEnter = () => {
    setIsOnScreen(true);
  };

  const onMouseLeave = () => {
    setIsVisible(false);
  };

  useLayoutEffect(() => {
    if (isOnScreen)
      setTimeout(() => {
        setIsVisible(isOnScreen);
      }, 100);
  }, [isOnScreen]);

  useLayoutEffect(() => {
    if (!isVisible)
      setTimeout(() => {
        setIsOnScreen(isVisible);
      }, 100);
  }, [isVisible]);

  return (
    <TooltipContainer>
      <TooltipChildrenWrapper
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {children}
      </TooltipChildrenWrapper>
      <TooltipBox $onScreen={isOnScreen} $visible={isVisible}>
        {content}
      </TooltipBox>
    </TooltipContainer>
  );
};
