import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from '../db/entities/transaction.entity';
import { AppUser } from '../db/entities/user.entity';
import { AppService } from '../app.service';
import { UserService } from './user.service';
import { DbModule } from '../db/db.module';
import { ServicesModule } from '../services/services.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([Transaction]),
		TypeOrmModule.forFeature([AppUser]),
		DbModule,
		ServicesModule,
	],
	controllers: [UserController],
	providers: [UserService, AppService],
})
export class UserModule { }
