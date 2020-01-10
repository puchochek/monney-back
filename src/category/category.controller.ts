import { Controller, Get, Post, Patch, Delete, Body, Param, Req } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from '../db/entities/category.entity';
import { TransactionCategory } from './category.dto';
// import { Request } from 'express';
import { JwtService } from '../services/jwt.service';
import { CryptService } from '../services/crypt.service';
import { CategoryException } from '../exceptions/category.exception';

@Controller('category')
export class CategoryController {
    constructor(
        private categoryService: CategoryService,
        private jwtService: JwtService,
        private cryptService: CryptService
    ) { }

    @Post()
    async createCategory(
        @Req() request,
        @Body() categoryToCreate: TransactionCategory
    ): Promise<Category> {
        let token: string;
        let userId: string;
        if (request.headers && request.headers.authorization && request.headers.authorization.split('Bearer ')[1]) {
            token = request.headers && request.headers.authorization && request.headers.authorization.split('Bearer ')[1]
        }
        if (token) {
            userId = this.jwtService.decodeJwt(token).data;
        }
        const categoryToSave = new Category;
        categoryToSave.id = this.cryptService.getId();
        categoryToSave.description = categoryToCreate.description;
        categoryToSave.user = categoryToCreate.user ? categoryToCreate.user : userId;
        categoryToSave.name = categoryToCreate.name;
        categoryToSave.icon = categoryToCreate.icon,
            categoryToSave.isDeleted = false;
        categoryToSave.isIncome = categoryToCreate.isIncome;
        categoryToSave.transactions = [];

        let category: Category;
        try {
            category = await this.categoryService.saveCategory(categoryToSave);
        } catch (error) {
            throw new CategoryException(error.message);
        }
        console.log('---> created category ', category);
        return category;
    }

    @Patch()
    async updateCategory(@Body() categoryToUpdate: TransactionCategory): Promise<Category> {
        const categoryToSave = new Category;
        categoryToSave.id = categoryToUpdate.id;
        categoryToSave.description = categoryToUpdate.description;
        categoryToSave.user = categoryToUpdate.user;
        categoryToSave.name = categoryToUpdate.name;
        categoryToSave.isDeleted = categoryToUpdate.isDeleted;
        categoryToSave.isIncome = categoryToUpdate.isIncome;
        categoryToSave.icon = categoryToUpdate.icon;

        let category: Category;
        try {
            category = await this.categoryService.updateCategory(categoryToSave);
        } catch (error) {
            throw new CategoryException(error.message);
        }
        console.log('---> updated category ', category);
        return category;
    }
}
