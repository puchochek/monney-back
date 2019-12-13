import { Controller, Get, Post, Patch, Delete, Body, Param, Req } from '@nestjs/common';
import { AppService } from '../app.service';
import { TransactionService } from './transaction.service';
import { Transaction } from '../db/entities/transaction.entity';
import { Request } from 'express';
import { TransactionException } from '../exceptions/transaction.exception';

@Controller('transaction')
export class TransactionController {
    constructor(
        private appService: AppService,
        private transactionService: TransactionService,
    ) { }

    @Post()
    async createTransaction(@Body() newExpence: any): Promise<Transaction> {
        const expenceToSave = new Transaction;
        expenceToSave.id = this.appService.getId();
        expenceToSave.isDeleted = false;
        expenceToSave.user = newExpence.userId;
        expenceToSave.date = new Date(newExpence.date);
        expenceToSave.sum = newExpence.sum;
        expenceToSave.comment = newExpence.comment;
        expenceToSave.category = newExpence.category;

        let createdTransaction: Transaction;
        try {
			createdTransaction = await this.transactionService.saveTransaction(expenceToSave);
		} catch (error) {
			throw new TransactionException(`Couldn't save the transaction.`);
		}
        return createdTransaction;
    }

    @Patch()
    async editTransaction(@Body() transactionToUpsert: any): Promise<Transaction> {
        let editedTransaction: Transaction;
        try {
			editedTransaction = await this.transactionService.updateTransaction(transactionToUpsert);
		} catch (error) {
			throw new TransactionException(`Couldn't edit the transaction.`);
		}
        return editedTransaction;
    }

    @Delete(`:transactionId`)
    async deleteTransaction(@Param('transactionId') transactionId, @Req() request: Request): Promise<Transaction> {
        const transactionToDelete = await this.transactionService.getTransactionById(transactionId);
        let deletedTransaction: Transaction;
        try {
			deletedTransaction = await this.transactionService.updateTransaction(transactionToDelete);
		} catch (error) {
			throw new TransactionException(`Couldn't delete the transaction.`);
		}
        return deletedTransaction;
    }
}
