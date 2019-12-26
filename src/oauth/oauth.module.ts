
import { Module } from '@nestjs/common';
import { OauthController } from './oauth.controller';
import { UserModule } from '../user/user.module';
import { ServicesModule } from '../services/services.module';

@Module({
	controllers: [OauthController],
	imports: [
		ServicesModule,
		UserModule],
})
export class OauthModule { }
