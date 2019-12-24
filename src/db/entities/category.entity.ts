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
@Unique(["name"])
export class Category {

    @PrimaryColumn('uuid')
    public id: string;

    @ManyToOne(type => User, user => user.categories)
    @Column({ nullable: true })
    public user: string;

    @OneToMany(type => Transaction, transaction => transaction.category)
    public transactions: Transaction[];

    @Column({ nullable: true })
    public name: string;

    @Column({ nullable: true })
    public description: string;

    @Column({ nullable: true })
    public is_deleted: boolean;

    @Column({ nullable: true })
    public is_income: boolean;

    @CreateDateColumn({ name: 'created_at' })
    public created_at: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    public updated_at: Date;
}