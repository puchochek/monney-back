import { UnprocessableEntityException } from '@nestjs/common';

export class CategoryException extends UnprocessableEntityException {
	constructor(message: string) {
		super(` ${message}`);
	}
}