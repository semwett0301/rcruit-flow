import { FontKey, Theme } from 'theme/types/theme';

export const extractFontPreset = (preset: FontKey) => (theme: Theme) => `
  font-family: ${theme.fontStyles[preset].fontFamily};
  font-weight: ${theme.fontStyles[preset].fontWeight};
  font-size: ${theme.fontStyles[preset].fontSize};
  line-height: ${theme.fontStyles[preset].lineHeight};
`;
