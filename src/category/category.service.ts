import { Injectable } from '@nestjs/common';
import { Category } from '../db/entities/category.entity';
import { ExpenceCategory } from './category.dto';
// import { TypeOrmModule } from '@nestjs/typeorm';
import { getRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
    ) { }

    // async getExpences(): Promise<Category[]> {
    //     return await this.expenceRepository.find();
    // }

    async saveNewCategory(newCategory: Category): Promise<Category> {
        // console.log('newCategory ', newCategory);
        return await this.categoryRepository.save(newCategory);
    }

    async getCategoriesByUserId(userId: string): Promise<Category[]> {
        const CATEGORY_FIELDS = [
			'category.id',
			'category.name',
			'category.user',
			'category.description',
			'category.isActive',
			'category.createdAt',
			'category.updatedAt',
		];
        const userCategories = await this.categoryRepository
            .createQueryBuilder('category')
            .select(CATEGORY_FIELDS)
            .where("category.user = :userId AND category.isActive = true", { userId: userId })
            .getMany();
        return userCategories;
    }

    //   async getExpenceByCategory(category: string) {
    //     const expence = await getRepository(Category)
    //       .createQueryBuilder('Expence')
    //       .where('Expence.type = :type', { type: category })
    //       .getMany();

    //     return expence;
    //   }
}