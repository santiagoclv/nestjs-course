import { FormEvent } from "react";
import {QRCodeSVG} from 'qrcode.react';
import { Navigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
// import { useTfaMutation } from "../../../redux/services/auth/auth";
import { useSelector } from "react-redux";
// import { RootState } from "../../../redux/store";

export default function TFAChallenge() {
  // const [tfa, { isSuccess }] = useTfaMutation();
  // const { challenge, id, otpauth, secret } = useSelector((state: RootState) => state.singin);
const otpauth = false;
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    // await tfa({
    //   challenge,
    //   id,
    //   token: data.get("token") as string,
    //   secret
    // }).unwrap();
  };

  // if (isSuccess) {
  //   return <Navigate to="/" />;
  // }

  return (
    <Box
      sx={{
        marginTop: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Sign in
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        {
          (otpauth) &&
            <>
              <Typography component="h1" variant="h5">
                Scan the QR Code with Google Authtenticator and then enter a valid TOTP
              </Typography>
              <QRCodeSVG value={otpauth} />
            </>
            
        }
        <TextField
          margin="normal"
          required
          fullWidth
          id="token"
          label="Token OTP"
          name="token"
          autoComplete="token"
          autoFocus
          type="number"
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          { otpauth
            ? "Engage and Sing In"
            : "Sing In"
          }
        </Button>
      </Box>
    </Box>
  );
}
