import { IsString } from "class-validator";

export class TokenPayloadDto {
  @IsString()
  email: string;

  @IsString()
  sub: string;
}