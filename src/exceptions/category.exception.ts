import { BadRequestException } from '@nestjs/common';

export class CategoryException extends BadRequestException {
    constructor(message: string) {
        super(`Can't save this category: ${message}`);
    }
}