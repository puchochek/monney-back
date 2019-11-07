import { Controller, Get, Post, Body, Param, Req } from '@nestjs/common';
import { AppService } from '../app.service';
import { CategoryService } from './category.service';
import { Category } from '../db/entities/category.entity';
import { TransactionCategory } from './category.dto';

@Controller('category')
export class CategoryController {
    constructor(
        private appService: AppService,
        private categoryService: CategoryService,
    ) { }

    @Post('upsert')
    async upsertCategory(@Body() categoriesToUpsert: any): Promise<Category[]> {
        let categories: Category[] = [];
        categoriesToUpsert.categoriesToUpsert.forEach(categoryToUpsert => {
            const categoryToSave = new Category;
            categoryToSave.id = categoryToUpsert.id ?
            categoryToUpsert.id
                : this.appService.getId();
                categoryToUpsert.name = categoryToUpsert.name;
            categoryToSave.description = categoryToUpsert.description;
            categoryToSave.user = categoryToUpsert.user;
            categoryToSave.name = categoryToUpsert.name;
            categoryToSave.isActive = categoryToUpsert.isActive;
            categoryToSave.isIncome = false;
            categoryToSave.categoryIndex = isNaN(categoryToUpsert.categoryIndex) ? -1 : categoryToUpsert.categoryIndex;
            categories.push(categoryToSave);
        });

        const result: Category[] = await this.categoryService.upsertExpenseCategory(categories);
        if (!result) {
            console.log('Error');
        }

        return result;
    }

    @Post('reorder')
    async reorderCategories(@Body() categoryData: any): Promise<Category[]> {
        const result: Category[] = await this.categoryService.reorderCategories(categoryData.userId, categoryData.draggedItemIndex, categoryData.targetItemIndex);
        if (!result) {
            console.log('Error');
        }

        return result;
    }

    // @Post('income')
    // async checkIncome(@Body() userIdData: any): Promise<Category> {
    //     const existedIncome: Category = await this.categoryService.findIncomeCategoryById(userIdData.userId);
    //     console.log('---> existedIncome ', existedIncome);
    //     if (existedIncome) {
    //         return existedIncome;
    //     } else {
    //         const incomeCategoryToSave = new Category;
    //         incomeCategoryToSave.id = this.appService.getId();
    //         incomeCategoryToSave.name = `income`;
    //         incomeCategoryToSave.description = `The category keeps users' incomes data`;
    //         incomeCategoryToSave.user = userIdData.userId;
    //         incomeCategoryToSave.isActive = true;
    //         incomeCategoryToSave.isIncome = true;

    //         const result: Category = await this.categoryService.saveIncomeCategory(incomeCategoryToSave);
    //         console.log('---> checkIncome result ', result);
    //         if (result) {
    //             return result;
    //         }
    //     }
    // }

    @Get(':userId')
    getCategoriesByUserId(@Param('userId') userId): Promise<Category[]> {
        return this.categoryService.getExpenseCategoriesByUserId(userId);
    }

    //   @Get()
    //   getExpences(): Promise<Expence[]> {
    //     return this.expenceService.getExpences();
    //   }

    //   @Get(':category')
    //   getExpenceByCategory(@Param('category') category): Promise<Expence[]> {
    //     return this.expenceService.getExpenceByCategory(category);
    //   }

    //   @Post()
    //   async createNewExpence(@Body() newExpence: NewExpence): Promise<Expence[]> {
    //     const expenceToSave = newExpence;
    //     expenceToSave.id = this.appService.getId();
    //     expenceToSave.date = this.appService.parseDate(newExpence.dateToParse);
    //     const result: Expence[] = await this.expenceService.saveNewExpence(expenceToSave);
    //     if (!result) {
    //       console.log('Error');
    //     }
    //     return result;
    //   }
}
