import { ForbiddenException } from '@nestjs/common';

export class TokenException extends ForbiddenException {
    constructor(message: string) {
        super(`${message}`);
    }
}