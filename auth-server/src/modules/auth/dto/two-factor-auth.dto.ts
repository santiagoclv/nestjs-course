import { IsNumber, IsString, ValidateIf } from "class-validator";

export class TwoFactorAuthDto {
  @IsNumber()
  id: number;

  @ValidateIf(({secret}) => secret !== undefined)
  @IsString()
  secret: string;

  @IsString()
  token: string;

  @IsString()
  challenge: string;
}
