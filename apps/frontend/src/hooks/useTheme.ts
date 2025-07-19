import { useTheme as useStyledTheme } from 'styled-components';
import { Theme } from 'theme/types/theme';

export const useTheme = () => useStyledTheme() as Theme;
