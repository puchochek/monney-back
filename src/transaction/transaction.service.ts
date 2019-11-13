import { Injectable } from '@nestjs/common';
import { Transaction } from '../db/entities/transaction.entity';
//import { NewExpence } from './expence.dto';
import { getRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TransactionService {
	constructor(
		@InjectRepository(Transaction)
		private readonly expenceRepository: Repository<Transaction>,
	) { }

	async getTransactions(): Promise<Transaction[]> {
		return await this.expenceRepository.find();
	}

	async saveNewExpence(newExpences: Transaction[]): Promise<Transaction[]> {
		console.log('---> EXP SERVICE newExpence ', newExpences);
		return await this.expenceRepository.save(newExpences);
	}

	async getTransactionsByCategory(category: string) {
		const expence = await getRepository(Transaction)
			.createQueryBuilder('transaction')
			.where('transaction.category = :category', { category: category })
			.getMany();

		return expence;
	}

	async upsertTransaction(tarnsactionsToUpsert: Transaction[]): Promise<Transaction[]> {
		return await this.expenceRepository.save(tarnsactionsToUpsert);
	}
}
