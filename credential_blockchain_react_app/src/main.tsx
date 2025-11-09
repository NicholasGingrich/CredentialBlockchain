import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './index.css';
import App from './App';

// Create a custom MUI theme
const theme = createTheme({
  palette: {
    background: {
      default: '#242424', // your original color
      paper: '#242424', // optional, for cards/panels
    },
    text: {
      primary: '#fff', // ensures TextFields and labels are visible
    },
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          borderColor: '#fff',
        },
        root: {
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#fff',
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#fff',
          '&.Mui-focused': {
            color: '#fff',
          },
          '&.MuiInputLabel-shrink': {
            color: '#fff',
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        icon: {
          color: 'white', // dropdown arrow
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          color: 'white', // affects icons inside TextField including the "x"
        },
      },
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>,
);
