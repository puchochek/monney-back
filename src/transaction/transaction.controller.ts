import { Controller, Get, Post, Body, Param, Req } from '@nestjs/common';
import { AppService } from '../app.service';
import { TransactionService } from './transaction.service';
import { CategoryService } from '../category/category.service'
import { Transaction } from '../db/entities/transaction.entity';
import { Category } from '../db/entities/category.entity';
import { IncomingTransaction } from './transaction.dto';

@Controller('transaction')
export class TransactionController {
    constructor(
        private appService: AppService,
        private transactionService: TransactionService,
        private categoryService: CategoryService,
    ) { }

    @Get()
    getTransactions(): Promise<Transaction[]> {
        return this.transactionService.getTransactions();
    }

    @Get(':category')
    getExpenceByCategory(@Param('category') category): Promise<Transaction[]> {
        return this.transactionService.getTransactionsByCategory(category);
    }

    @Post('create')
    async createNewTransaction(@Body() newExpences: any): Promise<Transaction[]> {
        console.log('---> newExpences ', newExpences);
        let expencesToSave: Transaction[] = [];
        newExpences.transactionsToUpsert.forEach(newExpence => {
            const expenceToSave = new Transaction;
            expenceToSave.id = this.appService.getId();
            expenceToSave.isDeleted = false;
            expenceToSave.user = newExpence.userId;
            expenceToSave.date = new Date(newExpence.date);
            expenceToSave.sum = newExpence.sum;
            expenceToSave.comment = newExpence.comment;
            expenceToSave.category = newExpence.category;
            expencesToSave.push(expenceToSave);
        });
console.log('---> expencesToSave ', expencesToSave);
        const result: Transaction[] = await this.transactionService.saveNewExpence(expencesToSave);
        if (!result) {
            console.log('Error');
        }
        return result;
    }

    @Post('edit')
    async editTransaction(@Body() transactionsToUpsert: any): Promise<Transaction[]> {
        console.log('---> editTransaction ', transactionsToUpsert.transactionsToUpsert);
        const result: Transaction[] = await this.transactionService.upsertTransaction(transactionsToUpsert.transactionsToUpsert);
        if (!result) {
            console.log('Error');
        }
        return result;

    }
}
