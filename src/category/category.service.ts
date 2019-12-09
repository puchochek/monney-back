import { Injectable } from '@nestjs/common';
import { Category } from '../db/entities/category.entity';
import { TransactionCategory } from './category.dto';
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
        private appService: AppService,
    ) { }

    async upsertCategory(categoriesToUpsert: Category[]): Promise<Category[]> {
        const userId = categoriesToUpsert[0].user;
        const userCategories = await this.getExpenseCategoriesByUserId(userId);
        categoriesToUpsert.forEach(categoryToUpsert => {
            if (categoryToUpsert.categoryIndex === -1) {
                categoryToUpsert.categoryIndex = this.getLastCategoryIndex(userCategories) + 1;
            }
        });

        const upsertedCategories = await this.categoryRepository.save(categoriesToUpsert);

        return upsertedCategories;
    }

    async getExpenseCategoriesByUserId(userId: string): Promise<Category[]> {
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

    getLastCategoryIndex(userCategories: Category[]): number {
        if (userCategories.length === 0) {
            return -1;
        }
        const userCategoriesSortedByIndex = userCategories.sort((a, b) => (a.categoryIndex > b.categoryIndex) ? 1 : -1);
        const lastCategoryIndex =  userCategoriesSortedByIndex[userCategoriesSortedByIndex.length - 1].categoryIndex;
        return lastCategoryIndex;
    }

    async findIncomeCategoryById(userId: string): Promise<Category> {
        const incomeCategory = await this.categoryRepository
            .createQueryBuilder('category')
            .select(CATEGORY_FIELDS)
            .where("category.user = :userId AND category.isIncome = true", { userId: userId })
            .getOne();
        console.log('---> incomeCategory ', incomeCategory);
        return incomeCategory;
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