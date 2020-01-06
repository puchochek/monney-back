import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { Transaction } from '../db/entities/transaction.entity';
import { ServicesModule } from '..//services/services.module';
import { CategoryModule } from '../category/category.module';




@Module({
	controllers: [TransactionController],
	providers: [TransactionService],
	imports: [
		TypeOrmModule.forFeature([Transaction]),
		ServicesModule,
		CategoryModule
	]
})
export class TransactionModule { }
