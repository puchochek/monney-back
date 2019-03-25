import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class AppUser {

  @PrimaryColumn()
  id: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true, unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

}