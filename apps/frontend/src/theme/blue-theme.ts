import { Theme } from 'theme/types/theme';

export const blueTheme: Theme = {
  colors: {
    blackBlue: '#191C22', // rgba(25, 28, 34, 1)
    brightBlue: '#1557FF', // rgba(21, 87, 255, 1)
    darkerBlue: '#1943AD', // rgba(25, 67, 173, 1)
    lighterBlue: '#DDE2EB', // rgba(221, 226, 235, 1)
    white: '#FDFEFF', // rgba(253, 254, 255, 1)
    backgroundBlue: '#1E2432', // rgba(30, 36, 50, 1)
    red: '#AD1919', // rgba(173, 25, 25, 1)
    green: '#23AD19', // rgba(35, 173, 25, 1)
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
    regularBold: {
      fontFamily: "'Inter', sans-serif",
      fontWeight: 700,
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
    xs: '10px',
    s: '20px',
    m: '30px',
    l: '40px',
    xl: '50px',
    xxl: '60px',
  },
  radius: {
    xs: '4px',
    s: '8px',
    m: '12px',
    xxl: '50px',
  },
};
