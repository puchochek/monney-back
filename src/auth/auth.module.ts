import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './google.strategy';
import { ServicesModule } from '..//services/services.module';

@Module({
	controllers: [AuthController],
	providers: [AuthService, GoogleStrategy],
	imports: [
		ServicesModule,
	]
})
export class AuthModule { }
