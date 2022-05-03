import { Controller, Get, Req, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from './users.service';
import { JwtService } from '../jwt/jwt.service';
import { GetUserDto } from './dto/get-user.dto';
import { plainToClass } from 'class-transformer';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  @Get('@me')
  async findMe(@Req() request: Request): Promise<GetUserDto> {
    try {
      const payload = await this.jwtService.verifyToken(request.cookies['access_token']);
      if (!payload){
        throw new UnauthorizedException("");
      }
      const { password, tfa_secret, ...user } = await this.usersService.findbyEmail(payload.email);
      if (!user){
        throw new UnauthorizedException();
      }
      return plainToClass(GetUserDto, user);
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
