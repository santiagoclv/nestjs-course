export class LoginResponse {
  otpauth?: string;
  secret?: string;
  id!: number;
  challenge!: string;
}
