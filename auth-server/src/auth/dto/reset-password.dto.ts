import { IsEmail, IsString, IsUUID } from "class-validator";
import { IsSamePropertyValue } from "../decorators/same-value-password.decorator";

export class ResetPasswordDto {
  @IsEmail()
  email: string;

  @IsUUID()
  token: string;

  @IsSamePropertyValue('confirm_password', { message: "password and confirm_password must be the same" })
  @IsString()
  password: string;

  @IsString()
  confirm_password: string;
}