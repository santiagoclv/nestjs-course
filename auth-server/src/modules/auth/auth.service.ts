import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '../jwt/jwt.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { Repository } from 'typeorm';
import { Reset } from './entities/reset.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        @InjectRepository(Reset)
        private readonly resetRepository: Repository<Reset>
    ) {}

    async storeTokenForgotPassword(token: string, email: string){
        const user = await this.usersService.findbyEmail(email);
        if(!user){
            throw new NotFoundException('user not found');
        }
        const reset = this.resetRepository.create({
            token,
            email
        });
        return this.resetRepository.save(reset);
    }
    
    async resetPassword(resetPasswordDto: ResetPasswordDto){
        const { token, email, password } = resetPasswordDto;
        const tokenRest = await this.resetRepository.findOne({
            token,
            email
        });
        
        if(!tokenRest){
            throw new UnauthorizedException('invalid token');
        }

        const user = await this.usersService.findbyEmail(email);

        if(!user){
            throw new NotFoundException('user not found');
        }

        await this.usersService.update(user.id, {
            password: await bcrypt.hash(password, 12)
        });

        await this.resetRepository.remove(tokenRest);

        return true;
    }

    async register(registerUserDto: RegisterUserDto) : Promise<boolean> {
        const { password, password_confirm } = registerUserDto;
        if(password !== password_confirm){
            throw new BadRequestException('passwords do not match');
        }
        const createUser: CreateUserDto = {
            ...registerUserDto,
            password: await bcrypt.hash(password, 12)
        };

        const { id } = await this.usersService.create(createUser);
        return !!id;
    }

    async refresh(refreshToken: string): Promise<string> {
        const { email } = await this.jwtService.verifyRefreshToken(refreshToken);
        const user = await this.usersService.findbyEmail(email);

        if(!user){
            throw new UnauthorizedException("wrong email or password");
        }

        return this.jwtService.generateToken(user);
    }

    async login(loginUserDto: LoginUserDto){
        const { password, email } = loginUserDto;
        const user = await this.usersService.findbyEmail(email);

        if(!user){
            throw new UnauthorizedException("wrong email or password");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        
        if(!isMatch){
            throw new UnauthorizedException("wrong email or password");
        }

        return {
            access_token: this.jwtService.generateToken(user),
            refresh_token: this.jwtService.generateRefreshToken(user)
        };
    }
}
