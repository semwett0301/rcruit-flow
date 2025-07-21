import styled, { css } from 'styled-components';
import { SquaredButton } from 'ui/SquareButton';

export type StepDescription = {
  label: string | number;
  current: boolean;
  disabled: boolean;
  onClick: () => void;
};

interface StepsRowProps {
  steps: StepDescription[];
}

const StepsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.m};

  width: 60px;
  height: 100%;
`;

const StepWrapper = styled.div<{ $current: boolean }>`
  width: fit-content;
  min-height: fit-content;

  display: flex;
  flex-direction: column;

  ${({ $current }) =>
    $current &&
    css`
      flex: 1;
    `};
`;

export const StepsColumn = ({ steps }: StepsRowProps) => {
  return (
    <StepsWrapper>
      {steps.map(({ label, current, disabled, onClick }) => (
        <StepWrapper $current={current} key={label}>
          <SquaredButton
            onClick={onClick}
            variant={current ? 'primary' : 'outline'}
            disabled={disabled}
          >
            {label}
          </SquaredButton>
        </StepWrapper>
      ))}
    </StepsWrapper>
  );
};
