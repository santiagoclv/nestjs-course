import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoffeesModule } from './coffees/coffees.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/coffeedb'),
    CoffeesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
