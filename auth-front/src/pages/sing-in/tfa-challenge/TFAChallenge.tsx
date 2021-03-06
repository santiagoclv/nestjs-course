import {QRCodeSVG} from 'qrcode.react';
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import useQuery from "../../../hooks/useQuery";

export default function TFAChallenge() {
  const referer = useQuery().get("referer") as string;
  const { challenge, id, otpauth, secret } = useSelector((state: RootState) => state.singin);

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
      <Box
        component="form"
        noValidate sx={{ mt: 1 }}
        method='post'
        action={`http://localhost:3000/auth/tfa?referer=${referer}`}
      >
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
          id="challenge"
          value={challenge}
          name="challenge"
          type="hidden"
        />
        <TextField
          id="id"
          value={id}
          name="id"
          type="hidden"
        />
        <TextField
          id="secret"
          value={secret}
          name="secret"
          type="hidden"
        />
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
