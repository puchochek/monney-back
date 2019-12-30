import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { ServicesModule } from '..//services/services.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../db/entities/category.entity';

@Module({
	controllers: [CategoryController],
	providers: [CategoryService],
	imports: [
		TypeOrmModule.forFeature([Category]),
		ServicesModule
	]
})
export class CategoryModule { }
