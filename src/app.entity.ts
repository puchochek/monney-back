import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Expence {

  @PrimaryColumn()
  id: string;

  @Column({ nullable: true })
  date: Date;

  @Column({ nullable: true })
  comment: string;

  @Column({ nullable: true })
  type: string;

  @Column({ nullable: true })
  sum: string;

}