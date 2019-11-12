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
import { Transaction } from './transaction.entity';

@Entity()
export class AppUser {

  @PrimaryColumn()
  public id: string;

  @OneToMany(type => Category, category => category.user)
  public categories: Category[];

  @OneToMany(type => Transaction, transaction => transaction.user)
  public transactions: Transaction[];

  @Column({ nullable: true })
  public name: string;
  //TODO make the field unique
  @Column({ nullable: true })
  public email: string;

  @Column({ nullable: true })
  public password: string;

  @Column({ nullable: true })
  public isConfirmed: boolean;

  @Column({ nullable: true })
  public avatar: string;

  @CreateDateColumn({ name: 'created_at' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt: Date;
}
