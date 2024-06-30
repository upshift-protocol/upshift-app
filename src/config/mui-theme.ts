import { blueGrey, blue, red, lightBlue, cyan, indigo, purple, teal, green, lime, lightGreen } from '@mui/material/colors';
import { ThemeOptions, createTheme } from '@mui/material/styles';
import { roboto } from './font';

const baseTheme: ThemeOptions = {
  typography: {
    fontFamily: roboto.style.fontFamily,
    h1: {
      fontSize: '48px',
    },
    h2: {
      fontSize: '36px',
    },
  },
  components: {
    MuiButton: {},
  },
}

export const lightTheme = createTheme({
  ...baseTheme,
  palette: {
    primary: {
      main: blue[500],
    },
    secondary: {
      main: blueGrey.A100,
    },
    error: {
      main: red.A400,
    },
  },
});

export const darkTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'dark',
    primary: {
      main: teal.A200,
    },
    secondary: {
      main: blueGrey.A100,
    },
    error: {
      main: red.A400,
    },
  },
});