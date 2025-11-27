import {
  Box,
  Button,
  TextField,
  Typography,
  Snackbar,
  Alert,
} from '@mui/material';
import { timeoutManager } from '@tanstack/react-query';
import { useState } from 'react';
import { useBaselineCentralizedContext } from './BaselineCentralizedContext';
import { registerNewUser, verifyLogin } from './utils';

export default function LoginScreen() {
  const { setShowLoginScreen } = useBaselineCentralizedContext();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [snack, setSnack] = useState({
    open: false,
    message: '',
    severity: 'info' as 'success' | 'error' | 'warning' | 'info',
  });
  const [newAccount, setNewAccount] = useState(false);

  function showSnack(
    message: string,
    severity: 'success' | 'error' | 'warning' | 'info',
  ) {
    setSnack({ open: true, message, severity });
  }

  async function handleLoginRequest() {
    if (!username || !password) {
      showSnack('Please enter both username and password', 'warning');
      return;
    }

    if (!newAccount) {
      const isValidLogin = await verifyLogin(username, password);
      if (isValidLogin) {
        showSnack('Login successful', 'success');
        await new Promise((r) => setTimeout(r, 2000));
        setShowLoginScreen(false);
      } else {
        showSnack('Invalid username or password', 'error');
      }
    } else {
      const success = registerNewUser(username, password);

      if (success) {
        showSnack('Account creation successful', 'success');
        await new Promise((r) => setTimeout(r, 2000));
        setShowLoginScreen(false);
      } else {
        showSnack('Erorr creating account', 'error');
      }
    }
  }

  const widgetTitle = newAccount
    ? 'Create New Account'
    : 'Login To Your Account';
  const buttonText = newAccount ? 'Create Account' : 'Login';
  const subText = newAccount
    ? 'Already have an account? Login with exisitng credentials'
    : "Don't have an account? Create New account";

  return (
    <>
      <Box
        sx={{
          p: '20px',
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 5 }}>
          <Typography variant="h2">Centralized Credential Storage</Typography>
        </Box>

        <Box
          sx={{
            alignSelf: 'center',
            justifySelf: 'center',
            alignContent: 'center',
            height: '70%',
          }}
        >
          <Box
            sx={{
              gap: '20px',
              display: 'flex',
              flexDirection: 'column',
              border: '1px solid #fff',
              borderRadius: '3px',
              p: '10px',
            }}
          >
            <Typography variant="h5">{widgetTitle}</Typography>

            <Box sx={{ display: 'flex', gap: '10px', width: '100%' }}>
              <TextField
                value={username}
                onChange={(evt) => setUsername(evt.target.value)}
                sx={{ width: '100%' }}
                label="Username"
              />
              <TextField
                type="password"
                value={password}
                onChange={(evt) => setPassword(evt.target.value)}
                sx={{ width: '100%' }}
                label="Password"
              />
            </Box>

            <Button
              sx={{ width: '100%' }}
              variant="contained"
              onClick={handleLoginRequest}
            >
              {buttonText}
            </Button>

            <Button onClick={() => setNewAccount(!newAccount)}>
              <Typography sx={{ alignSelf: 'center', mt: '-10px' }}>
                {subText}
              </Typography>
            </Button>
          </Box>
        </Box>
      </Box>

      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert
          onClose={() => setSnack({ ...snack, open: false })}
          severity={snack.severity}
          variant="filled"
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </>
  );
}
