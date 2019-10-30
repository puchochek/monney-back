import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DefaultNamingStrategy,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

import { Category } from './category.entity';
import { AppUser } from './user.entity';

@Entity()
export class Expence {

  @PrimaryColumn()
  public id: string;

  @ManyToOne(type => AppUser, user => user.expences)
  @Column({ nullable: true })
  public user: string;

  @Column({ nullable: true })
  public date: Date;

  @Column({ nullable: true })
  public comment: string;

  @ManyToOne(type => Category, category => category.expences)
  //@JoinColumn({ name: 'category' })
  public category: string;

  @Column({ nullable: true })
  public sum: string;

  @Column({ nullable: true })
  public isDeleted: boolean;

  @CreateDateColumn({ name: 'created_at' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt: Date;

}
