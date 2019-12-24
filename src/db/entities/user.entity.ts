import {
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	PrimaryColumn,
	Unique,
	UpdateDateColumn,
} from 'typeorm';

import { Category } from './category.entity';
import { Transaction } from './transaction.entity';

@Entity()
@Unique(["email"])
export class User {

	@PrimaryColumn()
	public id: string;

	@OneToMany(type => Category, category => category.user)
	public categories: Category[];

	@OneToMany(type => Transaction, transaction => transaction.user)
	public transactions: Transaction[];

	@Column({ nullable: true })
	public name: string;

	@Column({ nullable: true })
	public email: string;

	@Column({ nullable: true })
	public password: string;

	@Column({ nullable: true })
	public is_сonfirmed: boolean;

	@Column({ nullable: true })
	public avatar: string;

	@Column({ nullable: true, type: "float" })
    public balance_edge: number;

	@CreateDateColumn({ name: 'created_at' })
	public created_at: Date;

	@UpdateDateColumn({ name: 'updated_at' })
	public updated_at: Date;
}
