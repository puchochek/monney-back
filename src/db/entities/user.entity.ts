import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class AppUser {

  @PrimaryColumn()
  id: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  isConfirmed: boolean;

}
