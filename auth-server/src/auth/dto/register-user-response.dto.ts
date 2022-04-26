import { Exclude, Expose } from "class-transformer";

export class RegisterUserResponseDto {
  @Expose()
  id: number;
  @Expose()
  first_name: string;
  @Expose()
  last_name: string;
  @Expose()
  email: string;

  @Exclude()
  password:string;
}