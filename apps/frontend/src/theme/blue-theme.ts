import { Theme } from 'theme/types/theme';

export const blueTheme: Theme = {
  colors: {
    blackBlue: 'rgba(25, 28, 34, 1)',
    brightBlue: 'rgba(21, 87, 255, 1)',
    darkerBlue: 'rgba(25, 67, 173, 1)',
    lighterBlue: 'rgba(221, 226, 235, 1)',
    white: 'rgba(253, 254, 255, 1)',
    backgroundBlue: 'rgba(30, 36, 50, 1)',
    red: 'rgba(173, 25, 25, 1)',
    green: 'rgba(35, 173, 25, 1)',
  },
  fontStyles: {
    firstHeading: {
      fontFamily: "'Inter', sans-serif",
      fontWeight: 700,
      fontSize: '32px',
      lineHeight: '1em',
    },
    secondHeading: {
      fontFamily: "'Inter', sans-serif",
      fontWeight: 700,
      fontSize: '24px',
      lineHeight: '1em',
    },
    thirdHeading: {
      fontFamily: "'Inter', sans-serif",
      fontWeight: 400,
      fontSize: '16px',
      lineHeight: '1em',
    },
    regular: {
      fontFamily: "'Inter', sans-serif",
      fontWeight: 400,
      fontSize: '12px',
      lineHeight: '1em',
    },
    button: {
      fontFamily: "'Inter', sans-serif",
      fontWeight: 700,
      fontSize: '16px',
      lineHeight: '1em',
    },
  },
  spacing: {
    xs: '12px',
    s: '24px',
    m: '36px',
    l: '48px',
    xl: '60px',
  },
  radius: {
    xs: '4px',
    s: '8px',
    m: '12px',
    xxl: '50px',
  },
};
