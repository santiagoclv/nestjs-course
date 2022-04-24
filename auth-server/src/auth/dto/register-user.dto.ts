import { IsString, IsEmail } from "class-validator";
import { IsSamePropertyValue } from "../decorators/same-value-password.decorator";

export class RegisterUserDto {
  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsEmail()
  email: string;

  @IsSamePropertyValue('password_confirm', { message: "password and confirm_password must be the same" })
  @IsString()
  password: string;

  @IsString()
  password_confirm: string;
}