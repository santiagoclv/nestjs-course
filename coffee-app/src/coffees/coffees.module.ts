import { Module } from '@nestjs/common';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';

@Module({
    controllers: [CoffeesController], // routes that the module support
    providers: [CoffeesService], // business logic used by the parts of this module
  })
export class CoffeesModule {}
