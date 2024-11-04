import { red, pink, yellow } from '@mui/material/colors';
import type { ThemeOptions } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import { HEADER_FONT_WEIGHT } from '@/utils/constants/ui';
import FONTS from './fonts';

const borderRadius = '16rem';

const baseTheme: ThemeOptions = {
  typography: {
    fontFamily: FONTS.visiaPro.style.fontFamily,
    fontWeightRegular: 800,
    fontSize: 16,
    h1: {
      fontSize: '48px',
      fontFamily: FONTS.visiaPro.style.fontFamily,
      fontWeight: HEADER_FONT_WEIGHT,
      textTransform: 'uppercase',
    },
    h2: {
      fontSize: '36px',
      fontFamily: FONTS.visiaPro.style.fontFamily,
      fontWeight: HEADER_FONT_WEIGHT,
      textTransform: 'uppercase',
    },
    h3: {
      fontFamily: FONTS.visiaPro.style.fontFamily,
      fontWeight: HEADER_FONT_WEIGHT,
      textTransform: 'uppercase',
    },
    h4: {
      fontFamily: FONTS.visiaPro.style.fontFamily,
      fontWeight: HEADER_FONT_WEIGHT,
      textTransform: 'uppercase',
    },
    h5: {
      fontFamily: FONTS.visiaPro.style.fontFamily,
      fontWeight: HEADER_FONT_WEIGHT,
      textTransform: 'uppercase',
    },
    h6: {
      fontFamily: FONTS.visiaPro.style.fontFamily,
      fontWeight: HEADER_FONT_WEIGHT,
      textTransform: 'uppercase',
    },
    body2: {
      fontSize: 18,
    },
    body1: {
      fontSize: 18,
    },
    button: {
      fontFamily: FONTS.dinCondensed.style.fontFamily,
      textTransform: 'uppercase',
      fontSize: 17,
      lineHeight: 1.475,
    },
  },
  components: {
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius,
        },
        contained: {
          boxShadow: 'none',
          ':hover': {
            boxShadow: 'none',
          },
        },
      },
    },
  },
};

export const lightTheme = createTheme({
  ...baseTheme,
  palette: {
    primary: {
      main: '#00c260',
    },
    secondary: {
      main: '#dfe200',
    },
    error: {
      main: red.A200,
    },
    warning: {
      main: yellow['800'],
    },
  },
  components: {
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius,
        },
        contained: {
          color: '#fff',
        },
        outlined: {
          backdropFilter: 'blur(4px)',
          background: 'rgba(255, 255, 255, 0.2)',
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'dark',
    primary: {
      main: '#00FF7E',
    },
    secondary: {
      main: '#FCFF00',
    },
    error: {
      main: pink[400],
    },
  },
  components: {
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius,
        },
        outlined: {
          backdropFilter: 'blur(4px)',
          background: 'rgba(0, 0, 0, 0.2)',
        },
      },
    },
  },
});
