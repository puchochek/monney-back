import { Injectable } from '@nestjs/common';
import { Transaction } from '../db/entities/transaction.entity';
import { getRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryService } from '../category/category.service'


@Injectable()
export class TransactionService {
	constructor(
		@InjectRepository(Transaction)
		private readonly expenceRepository: Repository<Transaction>,
		private categoryService: CategoryService,
	) { }

	async getTransactions(): Promise<Transaction[]> {
		return await this.expenceRepository.find();
	}

	async saveNewExpence(newExpences: Transaction[]): Promise<Transaction[]> {
		console.log('---> EXP SERVICE newExpence ', newExpences);
		const transactionsToSave = []
		for (let i = 0; i< newExpences.length; i++) {
			const category = await this.categoryService.getCategoryByName(newExpences[i].category, newExpences[i].user);
			const transactionToSave = {...newExpences[i]};
			transactionToSave.category = category.id;
			transactionsToSave.push(transactionToSave);
		}

		return await this.expenceRepository.save(transactionsToSave);
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
