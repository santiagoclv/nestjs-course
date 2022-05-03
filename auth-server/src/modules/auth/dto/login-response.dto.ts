export class LoginResponseDto {
  otpauth?: string;
  secret?: string;
  id!: number;
  challenge!: string;
}
