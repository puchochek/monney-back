import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionController } from './transaction.controller';
import { Transaction } from '../db/entities/transaction.entity';
import { AppUser } from '../db/entities/user.entity';
import { Category } from '../db/entities/category.entity';
import { AppService } from '../app.service';
import { TransactionService } from './transaction.service';
import { CategoryService } from '../category/category.service'
import { DbModule } from '../db/db.module';
import { UserModule } from '../user/user.module';


@Module({
	imports: [
		TypeOrmModule.forFeature([Transaction]),
		TypeOrmModule.forFeature([AppUser]),
		TypeOrmModule.forFeature([Category]),
		TransactionModule,
		UserModule,
		DbModule,
	],
	controllers: [TransactionController],
	providers: [TransactionService, AppService, CategoryService],
})
export class TransactionModule { }

