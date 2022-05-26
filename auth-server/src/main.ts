import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/filter-name-exception.filter';
import { WrapResponseInterceptor } from './common/interceptor/wrap-response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    transform: true, // this will cast everything to the type of data that the controller's method argument define.
    transformOptions: {
      enableImplicitConversion: true
    },
  }));

  app.useGlobalInterceptors(
    new WrapResponseInterceptor()
  )

  app.enableCors({
    origin: [
      'http://localhost:3002',
      'http://localhost:3001',
      'https://app.gala.games'
    ],
    methods: ['GET', 'POST', 'OPTIONS']
  });
  app.use(cookieParser());

  app.useGlobalFilters(new HttpExceptionFilter);

  await app.listen(3000);
}
bootstrap();
