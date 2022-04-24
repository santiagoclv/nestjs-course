import { Controller, Get, Body, Patch, Param, Delete, Req, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtService } from '../jwt/jwt.service';
import { GetUserDto } from './dto/get-user.dto';
import { plainToInstance } from 'class-transformer';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  @Get('@me')
  async findOne(@Req() request: Request): Promise<GetUserDto> {
    try {
      const payload = await this.jwtService.verifyToken(request.cookies['access_token']);
      if (!payload){
        throw new UnauthorizedException("");
      }
      const user = await this.usersService.findbyEmail(payload.email);
      if (!user){
        throw new UnauthorizedException("");
      }
      return plainToInstance(GetUserDto, user);
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<GetUserDto> {
    const user = await  this.usersService.update(+id, updateUserDto);
    if (!user){
      throw new UnauthorizedException("");
    }
    return plainToInstance(GetUserDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
