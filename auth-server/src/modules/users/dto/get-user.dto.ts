import { Expose } from "class-transformer";

export class GetUserDto {
  @Expose()
  first_name: string;

  @Expose()
  last_name: string;

  @Expose()
  email: string;

  @Expose()
  id: number;
}