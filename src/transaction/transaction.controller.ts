import { Controller, Get, Post, Patch, Delete, Body, Param, Req } from '@nestjs/common';
import { AppService } from '../app.service';
import { TransactionService } from './transaction.service';
import { CategoryService } from '../category/category.service'
import { Transaction } from '../db/entities/transaction.entity';
import { Category } from '../db/entities/category.entity';
import { IncomingTransaction } from './transaction.dto';
import { Request } from 'express';


@Controller('transaction')
export class TransactionController {
    constructor(
        private appService: AppService,
        private transactionService: TransactionService,
        private categoryService: CategoryService,
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

        const result: Transaction = await this.transactionService.saveTransaction(expenceToSave);
        if (!result) {
            console.log('Error');
        }
        return result;
    }

    @Patch()
    async editTransaction(@Body() transactionToUpsert: any): Promise<Transaction> {
        const result: Transaction = await this.transactionService.updateTransaction(transactionToUpsert);
        if (!result) {
            console.log('Error');
        }

        return result;
    }

    @Delete(`:transactionId`)
    async deleteTransaction(@Param('transactionId') transactionId, @Req() request: Request): Promise<Transaction> {
        const transactionToDelete = await this.transactionService.getTransactionById(transactionId);
        transactionToDelete.isDeleted = true;

        const result: Transaction = await this.transactionService.updateTransaction(transactionToDelete);
        if (!result) {
            console.log('Error');
        }

        return result;
    }
}
