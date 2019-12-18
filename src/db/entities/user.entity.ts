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
@Unique(["email"])
export class AppUser {

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
	public isConfirmed: boolean;

	@Column({ nullable: true })
	public avatar: string;

	@Column({ nullable: true })
	public theme: string;

	@Column({ nullable: true, type: "float" })
	public balanceEdge: number;

	@Column({ nullable: true, type: "float" })
	public lastBalanceReset?: number;

	@Column({ nullable: true })
	public temporaryToken?: string;

	@CreateDateColumn({ name: 'created_at' })
	public createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at' })
	public updatedAt: Date;
}
