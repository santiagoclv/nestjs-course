import { Module } from '@nestjs/common';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import appConfig from './config/app.config';
import validationConfig from './config/validation.config';


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.environment',
      load: [appConfig],
      validationSchema: validationConfig
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.database_name'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '../../auth-front', 'build'),
    //   exclude: ['/auth/*', '/users/*'],
    //   // serveRoot: '/front'
    // }),
    UsersModule,
    AuthModule
  ]
})
export class AppModule {}
