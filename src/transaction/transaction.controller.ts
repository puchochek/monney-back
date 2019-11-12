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
    async createNewTransaction(@Body() newExpence: IncomingTransaction): Promise<Transaction> {
        const expenceToSave = new Transaction;
        expenceToSave.id = this.appService.getId();
        expenceToSave.isDeleted = false;
        expenceToSave.user = newExpence.userId;
        expenceToSave.date = new Date(newExpence.date);
        expenceToSave.sum = newExpence.sum;
        expenceToSave.comment = newExpence.comment;
        // if (newExpence.categoryId === 'undefined') {
        //     const incomeCategoryPromise = await this.categoryService.saveIncomeCategory(newExpence.userId);
        //     const incomeCategory = <Category>incomeCategoryPromise;
        //     expenceToSave.category = incomeCategory.id;
        // } else {
            expenceToSave.category = newExpence.categoryId;
        // }

        const result: Transaction = await this.transactionService.saveNewExpence(expenceToSave);
        if (!result) {
            console.log('Error');
        }
        return result;
    }

    @Post('edit')
    async editTransaction(@Body() tarnsactionToEdit: Transaction): Promise<Transaction> {
        const result: Transaction = await this.transactionService.editTransaction(tarnsactionToEdit);
        if (!result) {
            console.log('Error');
        }
        return result;

    }
}
