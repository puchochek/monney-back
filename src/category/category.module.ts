import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { AppService } from '../app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbModule } from '../db/db.module';
import { ServicesModule } from '../services/services.module';
import { Category } from '../db/entities/category.entity';

@Module({
  imports: [
		TypeOrmModule.forFeature([Category]),
		// TypeOrmModule.forFeature([AppUser]),
		DbModule,
		ServicesModule,
	],
  controllers: [CategoryController],
  providers: [CategoryService, AppService],
  exports: [CategoryService]
})
export class CategoryModule {}
