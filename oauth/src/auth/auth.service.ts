import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService) {}

    async register(registerUserDto: RegisterUserDto){
        const { password, password_confirm } = registerUserDto;
        if(password !== password_confirm){
            throw new BadRequestException('passwords do not match');
        }
        const createUser: CreateUserDto = {
            ...registerUserDto,
            password: await bcrypt.hash(password, 12)
        };

        return this.usersService.create(createUser);
    }
}
