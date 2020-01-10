import { BadRequestException } from '@nestjs/common';

export class UserException extends BadRequestException {
    constructor(message: string) {
        super(`Error while handling the User request: ${message}`);
    }
}