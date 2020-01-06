import { Injectable } from '@nestjs/common';
import { Category } from '../db/entities/category.entity';
import { TransactionCategory } from './category.dto';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from '../app.service';
import { getRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CATEGORY_FIELDS } from '../db/scopes/Category';


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

    async getCategoryByName(categoryName: string, userId: string): Promise<Category> {
        const category = await this.categoryRepository
            .createQueryBuilder('category')
            .select(CATEGORY_FIELDS)
            .where("category.name = :categoryName AND category.user = :userId", { categoryName: categoryName, userId: userId })
            .getOne();
        console.log('---> category by name ', category);
        return category;
    }
}
