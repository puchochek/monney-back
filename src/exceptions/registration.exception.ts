import { BadRequestException } from '@nestjs/common';

export class RegistrationException extends BadRequestException {
    constructor(message: string) {
        super(`User registration error: ${message}`);
    }
}