import { createTheme } from '@mui/material/styles';

export default createTheme({
  palette: {
    primary: { main: '#1a3e72' },
    secondary: { main: '#00bcd4' },
    background: { default: '#f4f6f8' },
  },
  components: {
    MuiPaper: {
      styleOverrides: { root: { borderRadius: 16, overflow: 'hidden' } }
    },
    MuiButton: {
      styleOverrides: { root: { borderRadius: 12, textTransform: 'none', fontWeight: 600 } }
    },
    MuiFab: {
      styleOverrides: { root: { boxShadow: '0 8px 16px rgba(0,0,0,0.2)' } }
    }
  },
  transitions: { duration: { shortest: 150 } }
});