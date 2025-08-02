import React, { forwardRef, useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { extractFontPreset } from 'theme/utils/extractFontPreset';
import { CheckIcon } from '@radix-ui/react-icons';

export type SelectOption<T extends string> = {
  label: string;
  value: T;
};

export interface SelectProps<T extends string> {
  options: SelectOption<T>[];
  placeholder?: string;
  onSelect?: (value: T[]) => void;
  selectedValues?: T[];
  multiple?: boolean;
  disabled?: boolean;
}

interface SelectDropdownProps {
  $isAnyChosen: boolean;
}

interface SelectOptionProps {
  $isChosen: boolean;
}

interface SelectHeaderProps {
  $isOpen: boolean;
}

interface ContainerInterface {
  $isDisabled: boolean;
}

const SelectContainer = styled.div<ContainerInterface>`
  position: relative;

  width: 100%;
  height: 60px;

  user-select: none;

  cursor: pointer;

  ${({ theme, $isDisabled }) => css`
    ${extractFontPreset('thirdHeading')(theme)}
    color: ${theme.colors.white};

    ${$isDisabled &&
    css`
      opacity: 0.4;
      cursor: not-allowed;
    `}
  `};
`;

const SelectHeader = styled.div<SelectHeaderProps>`
  display: flex;
  justify-content: space-between;
  align-items: center;

  width: 100%;
  height: 100%;

  background: transparent;

  ${({ theme, $isOpen }) => css`
    padding: ${theme.spacing.s};
    border-radius: ${theme.radius.s};

    border: 0.5px solid ${theme.colors.lighterBlue};
    outline: ${$isOpen ? `0.5px solid ${theme.colors.lighterBlue}` : 'none'};
  `}
`;

const Dropdown = styled.div<SelectDropdownProps>`
  position: absolute;
  left: 0;

  display: flex;
  flex-direction: column;

  overflow-x: hidden;
  overflow-y: scroll;

  width: 100%;
  max-height: 240px;

  ${({ theme, $isAnyChosen }) => css`
    top: calc(100% + ${theme.spacing.xs});

    gap: ${theme.spacing.xs};

    padding: ${$isAnyChosen ? 0 : theme.spacing.s} 0;

    background: ${theme.colors.backgroundBlue};

    border-radius: ${theme.radius.s};
    border: 1px solid ${theme.colors.lighterBlue};

    z-index: ${theme.zIndex.tooltip};
  `}

  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const Option = styled.div<SelectOptionProps>`
  display: flex;
  align-items: center;
  justify-content: space-between;

  min-height: 24px;

  cursor: pointer;

  ${({ $isChosen, theme }) => css`
    padding: 0 ${theme.spacing.s};

    ${$isChosen &&
    css`
      color: ${theme.colors.brightBlue};
    `}
  `}
`;

const ClearAll = styled.div`
  cursor: pointer;
  height: 54px;

  &:hover {
    text-decoration: underline;
  }

  ${({ theme }) => css`
    padding: ${theme.spacing.s};

    color: ${theme.colors.brightBlue};
    background-color: color-mix(
      in srgb,
      ${theme.colors.blackBlue} 60%,
      transparent
    );

    border-radius: ${theme.radius.s};
  `}
`;

const HeaderLine = styled.div<SelectDropdownProps>`
  width: 100%;
  max-width: 120px;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  ${({ $isAnyChosen, theme }) => css`
    color: ${!$isAnyChosen &&
    `color-mix(
        in srgb,
        ${theme.colors.lighterBlue} 40%,
        transparent
      );`};
  `}
`;

export const Select = forwardRef<HTMLDivElement, SelectProps<string>>(
  <T extends string>(
    {
      options,
      onSelect,
      disabled = false,
      selectedValues = [],
      placeholder = 'Select',
      multiple = false,
    }: SelectProps<T>,
    ref: React.Ref<HTMLDivElement>,
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState<T[]>(selectedValues);

    const toggleOpen = () => setIsOpen(!isOpen && !disabled);

    const correctMultipleSelectedList = (option: T) => {
      if (!selected.includes(option)) {
        setSelected([...selected, option]);
      } else {
        setSelected(selected.filter((el) => el !== option));
      }
    };

    const correctSingleSelectedList = (option: T) => {
      if (!selected.includes(option)) {
        setSelected([option]);
      } else {
        setSelected([]);
      }
    };

    const handleSelect = (option: T) => {
      if (!multiple) {
        correctSingleSelectedList(option);
        setIsOpen(false);
      } else {
        correctMultipleSelectedList(option);
      }
    };

    const handleClearAll = () => setSelected([]);

    const isAnyChosen = selected.length > 0;

    useEffect(() => {
      onSelect?.(selected);
    }, [JSON.stringify(selected)]);

    useEffect(() => {
      setIsOpen(false);
    }, [disabled]);

    return (
      <SelectContainer $isDisabled={disabled} ref={ref}>
        <SelectHeader $isOpen={isOpen} onClick={toggleOpen}>
          <HeaderLine $isAnyChosen={isAnyChosen}>
            {selected.length > 0 ? selected.join(', ') : placeholder}
          </HeaderLine>
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </SelectHeader>

        {isOpen && (
          <Dropdown $isAnyChosen={isAnyChosen && multiple}>
            {selected.length > 0 && multiple && (
              <ClearAll onClick={handleClearAll}>
                Clear all ({selected.length})
              </ClearAll>
            )}
            {options.map((opt) => (
              <Option
                $isChosen={selected.includes(opt.value)}
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
              >
                <span>{opt.label}</span>
                {selected.includes(opt.value) && (
                  <CheckIcon width={16} height={16} />
                )}
              </Option>
            ))}
          </Dropdown>
        )}
      </SelectContainer>
    );
  },
);

Select.displayName = 'Select';
