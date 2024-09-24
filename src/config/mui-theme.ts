import { red, pink, yellow } from '@mui/material/colors';
import type { ThemeOptions } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import { dinCondensed, titlingGothic } from './fonts';

const borderRadius = '16rem';

const baseTheme: ThemeOptions = {
  typography: {
    fontFamily: dinCondensed.style.fontFamily,
    h1: {
      fontSize: '48px',
      fontFamily: titlingGothic.style.fontFamily,
      textTransform: 'uppercase',
    },
    h2: {
      fontSize: '36px',
      fontFamily: titlingGothic.style.fontFamily,
      textTransform: 'uppercase',
    },
    h3: {
      fontFamily: titlingGothic.style.fontFamily,
      textTransform: 'uppercase',
    },
    h4: {
      fontFamily: titlingGothic.style.fontFamily,
      textTransform: 'uppercase',
    },
    h5: {
      fontFamily: titlingGothic.style.fontFamily,
      textTransform: 'uppercase',
    },
    h6: {
      fontFamily: titlingGothic.style.fontFamily,
      textTransform: 'uppercase',
    },
    body1: {
      fontSize: 18,
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
