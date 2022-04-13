import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import { WrapResponseInterceptor } from './common/interceptors/wrap-response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /**
   * Activating the pipeline with 2 special filters based on the dtos.
   */
  app.useGlobalPipes(new ValidationPipe({
    forbidNonWhitelisted: true,
    whitelist: true,
    transform: true, // this will cast everything to the type of data that the controller's method argument define.
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));
  
  app.useGlobalFilters(new HttpExceptionFilter);

  app.useGlobalInterceptors(
    new WrapResponseInterceptor(),
    new TimeoutInterceptor()
  );

  await app.listen(3000);
}
bootstrap();
