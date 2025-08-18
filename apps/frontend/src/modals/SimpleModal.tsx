import { create, remove } from '@ebay/nice-modal-react';
import { ReactNode } from 'react';
import { ModalContainer } from 'containers/ModalContainer';

interface SimpleModalProps {
  body: ReactNode;
}

export const SimpleModalBody = ({ body }: SimpleModalProps) => {
  return (
    <ModalContainer
      onClose={() => {
        remove(SimpleModal);
      }}
    >
      {body}
    </ModalContainer>
  );
};

export const SimpleModal = create(SimpleModalBody);
