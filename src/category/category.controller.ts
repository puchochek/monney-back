import { Controller, Get, Post, Patch, Delete, Body, Param, Req } from '@nestjs/common';
import { AppService } from '../app.service';
import { CategoryService } from './category.service';
import { Category } from '../db/entities/category.entity';
import { TransactionCategory } from './category.dto';
import { Request } from 'express';
import { JwtService } from '../services/jwt.service';
import { CategoryException } from '../exceptions/category.exception';


@Controller('category')
export class CategoryController {
    constructor(
        private appService: AppService,
        private categoryService: CategoryService,
        private jwtService: JwtService,
    ) { }

    @Post()
    async createCategory(@Body() categoryToCreate: any): Promise<Category[]> {
        const categoryToSave = new Category;
        categoryToSave.id = this.appService.getId();
        categoryToSave.description = categoryToCreate.description;
        categoryToSave.user = categoryToCreate.user;
        categoryToSave.name = categoryToCreate.name;
        categoryToSave.isActive = true;
        categoryToSave.isIncome = categoryToCreate.isIncome;
        categoryToSave.categoryIndex = isNaN(categoryToCreate.categoryIndex) ? -1 : categoryToCreate.categoryIndex;
        categoryToSave.icon = categoryToCreate.icon;
        const sameNameCategory = await this.categoryService.getCategoryByName(categoryToSave.name, categoryToSave.user);
        if (sameNameCategory && sameNameCategory.hasOwnProperty('id') && sameNameCategory.isActive) {
            throw new CategoryException(`Category of that name already exists.`);
        }
        let savedCategories: Category[];
        try {
			savedCategories = await this.categoryService.upsertCategory([categoryToSave])
		} catch (error) {
			throw new CategoryException(`Category save failed.`);
		}

        return savedCategories;
    }

    @Patch()
    async updateCategory(@Body() categoriesToUpdate: any): Promise<Category[]> {
        const categories: Category[] = [];
        categoriesToUpdate.forEach(categoryToCreate => {
            const categoryToSave = new Category;
            categoryToSave.id = categoryToCreate.id;
            categoryToSave.description = categoryToCreate.description;
            categoryToSave.user = categoryToCreate.user;
            categoryToSave.name = categoryToCreate.name;
            categoryToSave.isActive = true;
            categoryToSave.isIncome = categoryToCreate.isIncome;
            categoryToSave.categoryIndex = isNaN(categoryToCreate.categoryIndex) ? -1 : categoryToCreate.categoryIndex;
            categoryToSave.icon = categoryToCreate.icon;
            categories.push(categoryToSave);
        });
        const result: Category[] = await this.categoryService.upsertCategory(categories);
        if (!result) {
            console.log('Error');
        }

        return result;
    }

    @Delete(`:categoryName`)
    async deleteCategory(@Param('categoryName') categoryName, @Req() request: Request): Promise<Category[]> {
        let token: string;
        let userId: string;
        if (request.headers && request.headers.authorization && request.headers.authorization.split('Bearer ')[1]) {
            token = request.headers && request.headers.authorization && request.headers.authorization.split('Bearer ')[1]
        }
        if (token) {
            userId = this.jwtService.verifyJwt(token).data;
        }
        const categoryToDelete = await this.categoryService.getCategoryByName(categoryName, userId);
        categoryToDelete.isActive = false;

        const result: Category[] = await this.categoryService.upsertCategory([categoryToDelete]);
        if (!result) {
            console.log('Error');
        }

        return result;
    }

    @Get(':categoryName')
    getCategoryByName(@Param('categoryName') categoryName, @Req() request: Request): Promise<Category> {
        let token: string;
        let userId: string;
        if (request.headers && request.headers.authorization && request.headers.authorization.split('Bearer ')[1]) {
            token = request.headers && request.headers.authorization && request.headers.authorization.split('Bearer ')[1]
        }
        if (token) {
            userId = this.jwtService.verifyJwt(token).data;
        }

        return this.categoryService.getCategoryByName(categoryName, userId);
    }

}
