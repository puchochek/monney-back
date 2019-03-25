import { BadRequestException } from '@nestjs/common';

export class LoginUserError extends BadRequestException {
  constructor(message: string) {
    super(`Error login user: ${message}`);
  }
}