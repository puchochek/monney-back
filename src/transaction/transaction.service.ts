import { Injectable } from '@nestjs/common';
import { TransactionInput } from '../transaction/transaction.dto';
import { Transaction } from '../db/entities/transaction.entity';
import { CategoryService } from '../category/category.service'
import { CryptService } from '../services/crypt.service';
import { getRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TRANSACTION_FIELDS } from '../db/scopes/Transaction';

@Injectable()
export class TransactionService {

    constructor(
        @InjectRepository(Transaction)
        private readonly transactionRepository: Repository<Transaction>,
        private cryptService: CryptService,
        private categoryService: CategoryService
    ) {

    }

    async saveTransaction(newTransaction: TransactionInput): Promise<Transaction> {
        console.log('---> saveNewExpence ', newTransaction);
        const category = await this.categoryService.getCategoryByName(newTransaction.category, newTransaction.user);

        const transactionToSave = new Transaction;
        transactionToSave.id = this.cryptService.getId();
        transactionToSave.isDeleted = newTransaction.isDeleted;
        transactionToSave.user = newTransaction.user;
        transactionToSave.date = new Date(newTransaction.date);
        transactionToSave.sum = newTransaction.sum;
        transactionToSave.comment = newTransaction.comment;
        transactionToSave.category = category.id;

        return await this.transactionRepository.save(transactionToSave);
    }

    async updateTransaction(tarnsactionToUpdateData: TransactionInput): Promise<Transaction> {

        const transactionToUpdate = new Transaction;
        transactionToUpdate.id = tarnsactionToUpdateData.id;
        transactionToUpdate.isDeleted = tarnsactionToUpdateData.isDeleted;
        transactionToUpdate.date = new Date(tarnsactionToUpdateData.date);
        transactionToUpdate.sum = tarnsactionToUpdateData.sum;
        transactionToUpdate.comment = tarnsactionToUpdateData.comment;

		return await this.transactionRepository.save(transactionToUpdate);
	}
}
