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
import { Public } from 'src/common/decorators/public.decorator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { ParseIntPipe } from 'src/common/pipes/parse-int.pipe';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Coffee } from './entities/coffee.entity';

@Controller('coffees')
export class CoffeesController {
    constructor(private readonly coffeesService: CoffeesService) { }

    @Public()
    @Get()
    findAll(@Query() paginationQuery: PaginationQueryDto) {
        return this.coffeesService.findAll(paginationQuery);
    }

    // This is not the right way to transform a string through pipes, it is just to ilustrate a case.
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<Coffee> {
        const coffee = await this.coffeesService.findOne(id);
        if(!coffee) {
            throw new NotFoundException(`Coffe ${id} does not exit`);
        }
        return coffee;
    }

    @Post()
    create(@Body() createCoffeDto: CreateCoffeeDto) {
        return this.coffeesService.create(createCoffeDto);
    }

    // This is not the right way to transform a string through pipes, it is just to ilustrate a case.
    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updateCoffeDto: UpdateCoffeeDto) {
        return this.coffeesService.update(id, updateCoffeDto);
    }

    // This is not the right way to transform a string through pipes, it is just to ilustrate a case.
    @Patch('recommendations/:id')
    async recommendation(@Param('id', ParseIntPipe) id: number) {
        const coffee = await this.coffeesService.findOne(id);
        if(!coffee) {
            throw new NotFoundException(`Coffe ${id} does not exit`);
        }
        return this.coffeesService.recommendCoffee(coffee);
    }

    @Delete(':id')
    remove(@Param('id') id: number) {
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
