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

	async getExpences(): Promise<Transaction[]> {
		return await this.expenceRepository.find();
	}

	async saveNewExpence(newExpence: Transaction): Promise<Transaction> {
		console.log('---> EXP SERVICE newExpence ', newExpence);
		return await this.expenceRepository.save(newExpence);
	}

	async getExpenceByCategory(category: string) {
		const expence = await getRepository(Transaction)
			.createQueryBuilder('Expence')
			.where('Expence.type = :type', { type: category })
			.getMany();

		return expence;
	}

	async editTransaction(tarnsactionToEdit: Transaction): Promise<Transaction> {
		return await this.expenceRepository.save(tarnsactionToEdit);
	}
}
