import { Controller, Get, Post, Patch, Delete, Body, Param, Req } from '@nestjs/common';
import { AppService } from '../app.service';
import { TransactionService } from './transaction.service';
import { UserService } from '../user/user.service';
import { Transaction } from '../db/entities/transaction.entity';
import { Request } from 'express';
import { TransactionException } from '../exceptions/transaction.exception';
import { AppUser } from 'dist/db/entities/user.entity';
import { UserException } from '../exceptions/user.exception';


@Controller('transaction')
export class TransactionController {
    constructor(
        private appService: AppService,
        private transactionService: TransactionService,
        private userService: UserService,
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
            const newTransaction = await this.transactionService.saveTransaction(expenceToSave);
            if (newTransaction.comment === `Last month surplus.`) {
                const userWithUpdatedBalanceReset = await this.updateUserLastBalanceReset(expenceToSave);
                if (userWithUpdatedBalanceReset) {
                    createdTransaction = newTransaction;
                }
            }
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
        transactionToDelete.isDeleted = true;
        let deletedTransaction: Transaction;
        try {
            deletedTransaction = await this.transactionService.updateTransaction(transactionToDelete);
        } catch (error) {
            throw new TransactionException(`Couldn't delete the transaction.`);
        }
        return deletedTransaction;
    }

    async updateUserLastBalanceReset(createdTransaction: Transaction): Promise<AppUser> {
        const userToUpdate = await this.userService.getUserById(createdTransaction.user);
        const wasBalanceResetedThisMonth = this.checkLastSurplus(userToUpdate);
        let updatedUser: AppUser;
        if (!wasBalanceResetedThisMonth) {
            userToUpdate.lastBalanceReset = new Date().getMonth() + 1;
            try {
                updatedUser = await this.userService.updateUser(userToUpdate);
            } catch (error) {
                throw new UserException(`User Balance can't be reseted for this month`);
            }
        }
        return updatedUser;
    }


    checkLastSurplus(user: AppUser): boolean {
        const currentUserSurpluses = user.transactions.filter(transaction => transaction.comment === `Last month surplus.`);
        if (currentUserSurpluses.length) {
            const thisMonthSurpluse = currentUserSurpluses.find(transaction => new Date(transaction.date).getMonth() === (new Date().getMonth() + 1));
            if (thisMonthSurpluse) {
                return true;
            } else {
                return false;
            }
        }
    }
}
