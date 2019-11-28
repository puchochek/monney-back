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
    Generated,
    PrimaryGeneratedColumn
  } from 'typeorm';

  import { Transaction } from './transaction.entity';
  import { AppUser } from './user.entity';

@Entity()
export class Category {

    @PrimaryColumn('uuid')
    public id: string;

    @ManyToOne(type => AppUser, user => user.categories)
    @Column({ nullable: true })
    public user: string;

    @OneToMany(type => Transaction, transaction => transaction.category)
    public transactions: Transaction[];

    @Column({ nullable: false })
    public name: string;

    @Column({ nullable: true })
    public icon: string;

    @Column({ nullable: true })
    public description: string;

    @Column({ nullable: true })
    public isActive: boolean;

    @Column({ nullable: true })
    public isIncome: boolean;

    @Column({ nullable: true })
    public categoryIndex: number;

    @CreateDateColumn({ name: 'created_at' })
    public createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    public updatedAt: Date;

}