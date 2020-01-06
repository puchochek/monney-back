import { BadRequestException } from '@nestjs/common';

export class TransactionException extends BadRequestException {
    constructor(message: string) {
        super(`Can't save this transaction: ${message}`);
    }
}