import { Module } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from './jwt.service';

@Module({
  imports: [
    ConfigModule,
    NestJwtModule.register({}),
  ],
  providers: [
    JwtService
  ],
  exports: [
    JwtService
  ]
})
export class JwtModule {}
