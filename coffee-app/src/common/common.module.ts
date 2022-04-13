import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ApiKeyGuard } from './guards/api-key.guard';
import { LoggingMiddleware } from './middleware/logging.middleware';

@Module({
    imports: [ ConfigModule ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: ApiKeyGuard
        }
    ],

})
export class CommonModule implements NestModule {

    configure(consumer: MiddlewareConsumer) {
        // This common middleware LoggingMiddleware, tracks time it takes to respond a request.
        consumer
            .apply(LoggingMiddleware)
            .exclude('flavours')
            .forRoutes('coffees');
    }
}
