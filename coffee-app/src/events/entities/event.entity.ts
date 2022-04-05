import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index(['type', 'name']) // Index for tables could be created over multiple filds or individual
@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string; 

  @Column()
  name: string; 

  @Column('json')
  payload: Record<string, any>;
}