import { Injectable } from '@nestjs/common';
import { Expence } from '../db/entities/expence.entity';
//import { NewExpence } from './expence.dto';
import { getRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ExpenceService {
	constructor(
		@InjectRepository(Expence)
		private readonly expenceRepository: Repository<Expence>,
	) { }

	async getExpences(): Promise<Expence[]> {
		return await this.expenceRepository.find();
	}

	async saveNewExpence(newExpence: Expence): Promise<Expence> {
		console.log('---> EXP SERVICE newExpence ', newExpence);
		return await this.expenceRepository.save(newExpence);
	}

	async getExpenceByCategory(category: string) {
		const expence = await getRepository(Expence)
			.createQueryBuilder('Expence')
			.where('Expence.type = :type', { type: category })
			.getMany();

		return expence;
	}

	async editTransaction(tarnsactionToEdit: Expence): Promise<Expence> {
		return await this.expenceRepository.save(tarnsactionToEdit);
	}
}
