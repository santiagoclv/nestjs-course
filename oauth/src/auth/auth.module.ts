import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '../jwt/jwt.module';
import { Reset } from './entities/reset.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reset]),
    JwtModule,
    UsersModule
  ],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
