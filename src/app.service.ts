import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {

	constructor() { }

	getId(): string {
		const uuidv4 = require('uuid/v4');
		return uuidv4();
	}
}
