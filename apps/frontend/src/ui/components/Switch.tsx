import styled from 'styled-components';
import { HiddenCheckbox } from 'ui/components/Checkbox';
import { extractFontPreset } from 'theme/utils/extractFontPreset';
import { SwitchProps } from 'types/ui/SwitchOption';

const SwitchWrapper = styled.label`
  display: flex;
  align-items: center;
  width: fit-content;
  gap: ${({ theme }) => theme.spacing.xs};

  user-select: none;
`;

const Label = styled.span<{ $active: boolean }>`
  ${({ theme }) => extractFontPreset('thirdHeading')(theme)};

  color: ${({ theme, $active }) =>
    $active
      ? theme.colors.lighterBlue
      : `color-mix(
      in srgb,
      ${theme.colors.lighterBlue} 40%,
      transparent
    );`};

  transition: color 0.2s;
`;

const Track = styled.div`
  position: relative;

  width: 45px;
  height: 25px;

  border-radius: ${({ theme }) => theme.radius.xxl};
  border: 1px solid ${({ theme }) => theme.colors.lighterBlue};

  background: linear-gradient(
    135deg,
    rgba(10, 27, 71, 0.6),
    rgba(25, 67, 173, 0.7)
  );
`;

const Thumb = styled.span`
  position: absolute;
  top: 4px;
  left: 5px;

  width: 15px;
  height: 15px;

  border: 1px solid ${({ theme }) => theme.colors.lighterBlue};
  border-radius: 100%;

  background-color: color-mix(
    in srgb,
    ${({ theme }) => theme.colors.lighterBlue} 40%,
    transparent
  );

  ${HiddenCheckbox}:checked + ${Track} & {
    transform: translateX(18px);
  }

  transition: transform 0.2s ease;
`;

export function Switch({ options, value, onSwitch }: SwitchProps) {
  const [offOption, onOption] = options;
  const isOn = value === onOption.value;

  const handleToggle = () => {
    onSwitch?.(isOn ? offOption.value : onOption.value);
  };

  return (
    <SwitchWrapper>
      <Label $active={!isOn}>{offOption.label}</Label>

      <HiddenCheckbox checked={isOn} onChange={handleToggle} />
      <Track>
        <Thumb />
      </Track>
      <Label $active={isOn}>{onOption.label}</Label>
    </SwitchWrapper>
  );
}
