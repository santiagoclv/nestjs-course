import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/filter-name-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    forbidNonWhitelisted: true,
    whitelist: true,
    transform: true, // this will cast everything to the type of data that the controller's method argument define.
    transformOptions: {
      enableImplicitConversion: true
    },
  }));

  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true
  });
  app.use(cookieParser());

  app.useGlobalFilters(new HttpExceptionFilter);

  await app.listen(3000);
}
bootstrap();
