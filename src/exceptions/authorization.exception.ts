import { BadRequestException } from '@nestjs/common';

export class AuthorizationException extends BadRequestException {
  constructor(message: string) {
    super(`Oops! Authorization error: ${message}`);
  }
}