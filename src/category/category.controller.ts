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
            categoryToSave.isIncome = categoryToUpsert.isIncome;
            categoryToSave.categoryIndex = isNaN(categoryToUpsert.categoryIndex) ? -1 : categoryToUpsert.categoryIndex;
            categoryToSave.icon = categoryToUpsert.icon;
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

    @Get(':categoryName')
    getCategoryByName(@Param('categoryName') categoryName): Promise<Category> {

        return this.categoryService.getCategoryByName(categoryName);
    }

}
