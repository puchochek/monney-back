import { Injectable } from '@nestjs/common';
import { Category } from '../db/entities/category.entity';
import { TransactionCategory } from './category.dto';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from '../app.service';
import { getRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
    ) { }

    async upsertCategory(categoriesToUpsert: Category): Promise<Category> {
        const upsertedCategories = await this.categoryRepository.save(categoriesToUpsert);

        return upsertedCategories;
    }
}
