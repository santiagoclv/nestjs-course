import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Event, EventSchema } from 'src/events/entities/event.entity';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { Coffee, CoffeeSchema } from './entities/coffee.entity';

@Module({
    imports: [
      MongooseModule.forFeature([
        { 
          name: Coffee.name, 
          schema: CoffeeSchema 
        },
        { 
          name: Event.name, 
          schema: EventSchema 
        }
      ])
    ],
    controllers: [CoffeesController], // routes that the module support
    providers: [CoffeesService], // business logic used by the parts of this module
  })
export class CoffeesModule {}
