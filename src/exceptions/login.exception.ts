import { ForbiddenException } from '@nestjs/common';

export class LoginException extends ForbiddenException {
    constructor(message: string) {
        super(`${message}`);
    }
}