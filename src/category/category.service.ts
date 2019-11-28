import { Injectable } from '@nestjs/common';
import { Category } from '../db/entities/category.entity';
import { TransactionCategory } from './category.dto';
// import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from '../app.service';
import { getRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
        private appService: AppService
    ) { }

    // async getExpences(): Promise<Category[]> {
    //     return await this.expenceRepository.find();
    // }

    async upsertExpenseCategory(categoriesToUpsert: Category[]): Promise<Category[]> {
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
            'category.icon'
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

    getLastCategoryIndex(userCategories: Category[]): number {
        if (userCategories.length === 0) {
            return -1;
        }
        const userCategoriesSortedByIndex = userCategories.sort((a, b) => (a.categoryIndex > b.categoryIndex) ? 1 : -1);
        const lastCategoryIndex =  userCategoriesSortedByIndex[userCategoriesSortedByIndex.length - 1].categoryIndex;
        return lastCategoryIndex;
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
            'category.icon'
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

    // async createIncomeCategory(userId: string): Promise<Category> {
    //     const incomeCategoryToSave = new Category;
    //         incomeCategoryToSave.id = this.appService.getId();
    //         incomeCategoryToSave.name = `income`;
    //         incomeCategoryToSave.description = `The category keeps users' incomes data`;
    //         incomeCategoryToSave.user = userId;
    //         incomeCategoryToSave.isActive = true;
    //         incomeCategoryToSave.isIncome = true;
    //     return await this.categoryRepository.save(incomeCategoryToSave);
    // }

    async getCategoryById(categoryId: string): Promise<Category> {
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
            'category.icon'
        ];
        const category = await this.categoryRepository
            .createQueryBuilder('category')
            .select(CATEGORY_FIELDS)
            .where("category.id = :categoryId", { categoryId: categoryId })
            .getOne();
        console.log('---> category ', category);
        return category;

    }

    //   async getExpenceByCategory(category: string) {
    //     const expence = await getRepository(Category)
    //       .createQueryBuilder('Expence')
    //       .where('Expence.type = :type', { type: category })
    //       .getMany();

    //     return expence;
    //   }
}