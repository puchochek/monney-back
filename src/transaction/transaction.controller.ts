import { Controller, Req, Body, Post, Get, Param } from '@nestjs/common';
import { TransactionInput } from '../transaction/transaction.dto';
import { TransactionService } from './transaction.service';
import { CryptService } from '../services/crypt.service';
import { JwtService } from '../services/jwt.service';
import { Transaction } from '../db/entities/transaction.entity';
import { TransactionException } from '../exceptions/transaction.exception';

@Controller('transaction')
export class TransactionController {

    constructor(
        private transactionService: TransactionService,
        // private cryptService: CryptService,
        private jwtService: JwtService,

    ) { }

    @Get('/:category')
    async getTransactionsByCategory(
        @Req() request,
        @Param('category') category: string): Promise<Transaction[]> {
        let token: string;
        let userId: string;
        if (request.headers && request.headers.authorization && request.headers.authorization.split('Bearer ')[1]) {
            token = request.headers && request.headers.authorization && request.headers.authorization.split('Bearer ')[1]
        }
        if (token) {
            userId = this.jwtService.decodeJwt(token).data;
        }
        let transactions: Transaction[];
        try {
            transactions = await this.transactionService.getTransactionsByCategoryAndUserId(category, userId);
        } catch (error) {
            throw new TransactionException(error.message);
        }
        console.log('---> getTransactionsByCategory controller ', transactions);
        return transactions;
    }

    @Post()
    async createTransaction(
        @Req() request,
        @Body() newTransaction: TransactionInput): Promise<Transaction> {
        let token: string;
        let userId: string;
        if (!newTransaction.user) {
            if (request.headers && request.headers.authorization && request.headers.authorization.split('Bearer ')[1]) {
                token = request.headers && request.headers.authorization && request.headers.authorization.split('Bearer ')[1]
            }
            if (token) {
                userId = this.jwtService.decodeJwt(token).data;
                newTransaction.user = userId;
            }
        }

        let transaction: Transaction;
        try {
            transaction = await this.transactionService.saveTransaction(newTransaction);
        } catch (error) {
            throw new TransactionException(error.message);
        }
        console.log('---> created transaction ', transaction);
        return transaction;
    }
}
