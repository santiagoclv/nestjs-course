import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Creating Schema definition
@Schema()
export class Coffee extends Document {
  @Prop() 
  name: string;

  @Prop()
  brand: string;

  @Prop()
  recommendations: number;

  @Prop([String])
  flavors: string[];
}

// Create Schema based on Schema definition
export const CoffeeSchema = SchemaFactory.createForClass(Coffee);