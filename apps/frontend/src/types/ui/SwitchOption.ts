import { HTMLAttributes } from 'react';

export interface SwitchOption {
  label: string;
  value: string;
}

export interface SwitchProps extends HTMLAttributes<HTMLDivElement> {
  options: [SwitchOption, SwitchOption];
  value?: string;
  onSwitch?: (value: string) => void;
}
