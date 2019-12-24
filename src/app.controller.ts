import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {
		{
			console.log('---> Hello, monney');
		}
	}

	@Get()
	getHello(): string {
		return this.appService.getHello();
	}
}
