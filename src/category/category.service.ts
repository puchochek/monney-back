import { Injectable } from '@nestjs/common';
import { Category } from '../db/entities/category.entity';
import { ExpenceCategory } from './category.dto';
// import { TypeOrmModule } from '@nestjs/typeorm';
import { getRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {Not} from "typeorm";
import { runInThisContext } from 'vm';


@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
    ) { }

    // async getExpences(): Promise<Category[]> {
    //     return await this.expenceRepository.find();
    // }

    async upsertExpenseCategory(newCategory: Category): Promise<Category> {
        console.log('---> categoryToUpsert ', newCategory);
        const CATEGORY_FIELDS = [
            'category.user',
            'category.categoryIndex',
            'category.isActive',
            'category.isIncome',
        ];
        let categoriesBeforeUpsert: Category[] = [];
        const lastCategory = await this.categoryRepository
            .createQueryBuilder('category')
            .select(CATEGORY_FIELDS)
            .where("category.user = :userId AND category.isActive = true AND category.isIncome = false", { userId: newCategory.user })
            .orderBy("category.categoryIndex", "DESC")
            .getOne();

        if (newCategory.isActive) {
            newCategory.categoryIndex = lastCategory ?
                lastCategory.categoryIndex + 1
                : 0;
        } else {
            categoriesBeforeUpsert = await this.getExpenseCategoriesByUserId(newCategory.user);
        }

        const upsertedCategory = await this.categoryRepository.save(newCategory);

        if (upsertedCategory && !upsertedCategory.isActive) {
            this.updateCategoriesOrder(categoriesBeforeUpsert, newCategory);
        }

        return upsertedCategory;
    }

    async getExpenseCategoriesByUserId(userId: string): Promise<Category[]> {
        const CATEGORY_FIELDS = [
            'category.id',
            'category.name',
            'category.user',
            'category.description',
            'category.categoryIndex',
            'category.isIncome',
            'category.isActive',
            'category.createdAt',
            'category.updatedAt',
        ];
        const userCategories = await this.categoryRepository
            .createQueryBuilder('category')
            .select(CATEGORY_FIELDS)
            .where("category.user = :userId AND category.isActive = true AND category.isIncome = false", { userId: userId })
            .getMany();

        return userCategories;
    }

    updateCategoriesOrder(userCategories: Category[], deletedCategory: Category) {
        const deletedCategoryIndex = userCategories.find(category => category.id === deletedCategory.id).categoryIndex;
        const categoriesWithUpdatedIndex = userCategories.reduce((resultArray, currentCategory) => {
            if (currentCategory.categoryIndex < deletedCategoryIndex) {
                resultArray.push(currentCategory);
            }
            if (currentCategory.categoryIndex > deletedCategoryIndex) {
                const categoryWithUpdatedIndex = currentCategory;
                categoryWithUpdatedIndex.categoryIndex = currentCategory.categoryIndex - 1;
                resultArray.push(categoryWithUpdatedIndex);
            }
            return resultArray;
        }, []);

        this.categoryRepository.save(categoriesWithUpdatedIndex);
    }

    async reorderCategories(userId: string, draggedItemIndex: number, targetItemIndex: number): Promise<Category[]> {
        const userCategories = await this.getExpenseCategoriesByUserId(userId);
        const categoriesToUpdate = userCategories.reduce((resultArray, currentCategory) => {
            if (currentCategory.categoryIndex === draggedItemIndex) {
                const categoryWithNewIndex = currentCategory;
                categoryWithNewIndex.categoryIndex = targetItemIndex;
                resultArray.push(categoryWithNewIndex);
            } else if (currentCategory.categoryIndex === targetItemIndex) {
                const categoryWithNewIndex = currentCategory;
                categoryWithNewIndex.categoryIndex = draggedItemIndex;
                resultArray.push(categoryWithNewIndex);
            } else {
                resultArray.push(currentCategory);
            }
            return resultArray;
        }, []);
        const updatedCategories = await this.categoryRepository.save(categoriesToUpdate);

        return updatedCategories;
    }

    async findIncomeCategoryById(userId: string): Promise<Category> {
        const CATEGORY_FIELDS = [
            'category.id',
            'category.name',
            'category.user',
            'category.description',
            'category.categoryIndex',
            'category.isActive',
            'category.isIncome',
            'category.createdAt',
            'category.updatedAt',
        ];
        const incomeCategory = await this.categoryRepository
            .createQueryBuilder('category')
            .select(CATEGORY_FIELDS)
            .where("category.user = :userId AND category.isIncome = true", { userId: userId })
            .getOne();
        console.log('---> incomeCategory ', incomeCategory);
        //const isIncomeExist = incomeCategory ? true: false;
        return incomeCategory;
    }

    async saveIncomeCategory(incomeCategory: Category): Promise<Category> {
        return await this.categoryRepository.save(incomeCategory);
    }

    //   async getExpenceByCategory(category: string) {
    //     const expence = await getRepository(Category)
    //       .createQueryBuilder('Expence')
    //       .where('Expence.type = :type', { type: category })
    //       .getMany();

    //     return expence;
    //   }
}