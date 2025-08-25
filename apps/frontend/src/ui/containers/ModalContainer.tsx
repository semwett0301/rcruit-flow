import { Cross1Icon } from '@radix-ui/react-icons';
import React, { PropsWithChildren, useEffect } from 'react';
import styled, { css } from 'styled-components';

const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;

  width: 100vw;
  height: 100vh;

  display: flex;
  justify-content: center;
  align-items: center;

  background-color: rgba(25, 28, 34, 0.6);
`;

const ModalBodyWrapper = styled.div`
  position: relative;

  width: 100%;
  max-width: 600px;

  height: 360px;

  background: linear-gradient(
    to right,
    rgba(10, 27, 71, 0.6),
    rgba(25, 67, 173, 0.7)
  );

  opacity: 1;

  ${({ theme }) => css`
    -webkit-backdrop-filter: blur(${theme.radius.s});
    backdrop-filter: blur(${theme.radius.s});

    border-radius: ${theme.radius.s};

    border: 1px solid
      color-mix(in srgb, ${theme.colors.lighterBlue} 40%, transparent);
  `}
`;

const CrossIconWrapper = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;

  cursor: pointer;

  ${({ theme }) => css`
    color: ${theme.colors.white};
  `}

  &:hover {
    opacity: 0.6;
  }
`;

const ModalBody = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100%;
`;

interface ModalContainerProps {
  onClose?: () => void;
}

export const ModalContainer = ({
  children,
  onClose,
}: PropsWithChildren<ModalContainerProps>) => {
  const handleCloseClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    onClose?.();
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };

    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  return (
    <ModalWrapper>
      <ModalBodyWrapper>
        <CrossIconWrapper onClick={handleCloseClick}>
          <Cross1Icon width={20} height={20} />
        </CrossIconWrapper>
        <ModalBody>{children}</ModalBody>
      </ModalBodyWrapper>
    </ModalWrapper>
  );
};
