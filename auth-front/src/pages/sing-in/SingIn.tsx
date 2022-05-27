import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Copyright from '../../components/copyrights/Copyrights';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import TFAChallenge from './tfa-challenge/TFAChallenge';
import EmailPassword from './email-password/EmailPassword';
import { useEffect } from 'react';
import { loginState, initialState } from '../../redux/slices/sing-in';

// ToDo investigate if this is ok
const theme = createTheme();

export default function SignIn() {
  const { challenge } = useSelector((state: RootState) => state.singin);
  const dispatcher = useDispatch();

  useEffect(() => {
    return () => {
      dispatcher(loginState(initialState))
    }
  }, [dispatcher]);

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        {
          challenge
            ? <TFAChallenge />
            : <EmailPassword />
        }
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}