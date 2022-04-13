import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateCoffeeDto {
    @ApiProperty({ description: 'The name of a coffee.' })
    @IsString()
    readonly name: string;

    @ApiProperty({ description: 'The coffees brand.' })
    @IsString()
    readonly brand: string;

    @ApiProperty({ description: 'The topics or extra flavors with this coffee.' })
    @IsString({ each: true })
    readonly flavors: string[];
}