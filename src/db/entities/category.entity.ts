import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryColumn,
    Unique,
    UpdateDateColumn,
  } from 'typeorm';

  import { Transaction } from './transaction.entity';
  import { User } from './user.entity';

@Entity()
export class Category {

    @PrimaryColumn('uuid')
    public id: string;

    @PrimaryColumn()
    @Column({ nullable: false })
    public name: string;

    @ManyToOne(type => User, user => user.categories)
    @Column({ nullable: true })
    public user: string;

    @OneToMany(type => Transaction, transaction => transaction.category)
    public transactions: Transaction[];

    @Column({ nullable: true })
    public description: string;

    @Column({ nullable: true })
    public icon: string;

    @Column({ name: 'is_deleted', nullable: true })
    public isDeleted: boolean;

    @Column({ name: 'is_income', nullable: true })
    public isIncome: boolean;

    @CreateDateColumn({ name: 'created_at' })
    public createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    public updatedAt: Date;
}