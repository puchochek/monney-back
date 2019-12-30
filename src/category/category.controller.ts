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
    async createCategory(@Body() categoryToCreate: TransactionCategory): Promise<Category> {
        const categoryToSave = new Category;
        categoryToSave.id = this.cryptService.getId();
        categoryToSave.description = categoryToCreate.description;
        categoryToSave.user = categoryToCreate.user;
        categoryToSave.name = categoryToCreate.name;
        categoryToSave.isDeleted = false;
        categoryToSave.isIncome = categoryToCreate.isIncome;
        categoryToSave.transactions = [];
        //categoryToSave.icon = categoryToCreate.icon; //FFU

        let category: Category;
        try {
            category = await this.categoryService.upsertCategory(categoryToSave);
        } catch (error) {
            throw new CategoryException(error.message);
        }
        console.log('---> created category ', category );
        return category;
    }
}
