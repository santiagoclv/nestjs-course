import {
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    Patch,
    Post,
    Query,
} from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Coffee } from './entities/coffee.entity';

@Controller('coffees')
export class CoffeesController {
    constructor(private readonly coffeesService: CoffeesService) { }

    @Get()
    findAll(@Query() paginationQuery) {
        // const { limit, offset } = paginationQuery;
        return this.coffeesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string): Coffee {
        const coffee = this.coffeesService.findOne(id);
        if(!coffee) {
            throw new NotFoundException(`Coffe ${id} does not exit`);
        }
        return coffee;
    }

    @Post()
    create(@Body() createCoffeDto: CreateCoffeeDto) {
        return this.coffeesService.create(createCoffeDto);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateCoffeDto: UpdateCoffeeDto) {
        return this.coffeesService.update(id, updateCoffeDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.coffeesService.remove(id);
    }

    // It could become platform dependent (from Express)
    // @Get()
    // findAll(@Res() response) { 
    // // Express.js example using status() and send() methods 
    // response.status(200).send(‘This action returns all coffees’);
    // }

    // PUT replace entirely resource
    // PATCH can update parts from the resource
}
