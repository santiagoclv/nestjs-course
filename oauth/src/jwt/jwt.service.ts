import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { TokenPayloadDto } from './dto/token-payload.dto';

@Injectable()
export class JwtService {
    constructor(
        private readonly nestJwtService: NestJwtService,
        private readonly configService: ConfigService
    ){}

    generateToken(user: User) : string {
        const payload = { email: user.email, sub: user.id };
        return this.nestJwtService.sign(payload, {
            secret: this.configService.get('jwt.secret'),
            expiresIn: this.configService.get('jwt.expire_time'),
        });
    }

    generateRefreshToken(user: User) : string {
        const payload = { email: user.email, sub: user.id };
        return this.nestJwtService.sign(payload, {
            secret: this.configService.get('jwt.secret_refresh'),
            expiresIn: this.configService.get('jwt.expire_time_refresh'),
        });
    }

    verifyToken(token: string): Promise<TokenPayloadDto> {
        return this.nestJwtService.verifyAsync(token, {
            secret: this.configService.get('jwt.secret')
        });
    }

    verifyRefreshToken(token: string): Promise<TokenPayloadDto> {
        return this.nestJwtService.verifyAsync(token, {
            secret: this.configService.get('jwt.secret_refresh')
        });
    }
}
