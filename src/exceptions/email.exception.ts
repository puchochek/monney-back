import { BadRequestException } from '@nestjs/common';

export class EmailException extends BadRequestException {
    constructor(message: string) {
        super(`Email error: ${message}`);
    }
}