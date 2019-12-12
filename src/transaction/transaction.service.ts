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

	async saveTransaction(newExpence: Transaction): Promise<Transaction> {
		const transactionsToSave = []
			const category = await this.categoryService.getCategoryByName(newExpence.category, newExpence.user);
			const transactionToSave = {...newExpence};
			transactionToSave.category = category.id;
			transactionsToSave.push(transactionToSave);

		return await this.expenceRepository.save(transactionToSave);
	}

	async getTransactionsByCategory(category: string) {
		const transactions = await getRepository(Transaction)
			.createQueryBuilder('transaction')
			.where('transaction.category = :category', { category: category })
			.getMany();

		return transactions;
	}

	async getTransactionById(id: string) {
		const transaction = await getRepository(Transaction)
			.createQueryBuilder('transaction')
			.where('transaction.id = :id', { id: id })
			.getOne();

		return transaction;
	}

	async updateTransaction(tarnsactionToUpsert: Transaction): Promise<Transaction> {
		return await this.expenceRepository.save(tarnsactionToUpsert);
	}
}
