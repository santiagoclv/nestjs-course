import { FormEvent, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import EmailOutlined from '@mui/icons-material/EmailOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Copyright from '../../components/copyrights/Copyrights';
import { useForgotPasswordMutation } from '../../redux/services/auth/auth';


// ToDo investigate if this is ok
const theme = createTheme();

export default function ForgotPassword() {
  const [ tokenRedirect, setTokenRedirect ] = useState<string>();
  const [ forgotPasswordRequest, { isSuccess } ] = useForgotPasswordMutation();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const token = await forgotPasswordRequest({
      email: data.get('email') as string
    }).unwrap();

    setTokenRedirect(token)
  };

  if(isSuccess && tokenRedirect){
    return <Navigate to={`/reset-password/${tokenRedirect}`} />;
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <EmailOutlined />
          </Avatar>
          <Typography component="h1" variant="h5">
            Please enter your email
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Send
            </Button>
            <Grid container>
              <Grid item>
                <Link to={'/singup'} >
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}