import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm';

import { Category } from './category.entity';
import { User } from './user.entity';

@Entity()
export class Transaction {

    @PrimaryColumn()
    public id: string;

    @ManyToOne(type => User, user => user.transactions)
    @Column({ nullable: true })
    public user: string;

    @Column({ nullable: true })
    public date: Date;

    @Column({ nullable: true })
    public comment: string;

    @ManyToOne(type => Category, category => category.transactions)
    @Column({ nullable: true })
    public category: string;

    @Column({ nullable: true, type: "float" })
    public sum: number;

    @Column({ nullable: true })
    public is_deleted: boolean;

    @CreateDateColumn({ name: 'created_at' })
    public created_at: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    public updated_at: Date;
}