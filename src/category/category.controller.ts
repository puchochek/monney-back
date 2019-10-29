import { Controller, Get, Post, Body, Param, Req } from '@nestjs/common';
import { AppService } from '../app.service';
import { CategoryService } from './category.service';
import { Category } from '../db/entities/category.entity';
import { ExpenceCategory } from './category.dto';

@Controller('category')
export class CategoryController {
    constructor(
        private appService: AppService,
        private categoryService: CategoryService,
    ) { }

    @Post('upsert')
    async upsertCategory(@Body() newCategory: ExpenceCategory): Promise<Category> {
        const categoryToSave = new Category;
        categoryToSave.id = newCategory.id ?
            newCategory.id
            : this.appService.getId();
        categoryToSave.name = newCategory.name;
        categoryToSave.description = newCategory.description;
        categoryToSave.user = newCategory.user;
        categoryToSave.isActive = newCategory.isActive;

        const result: Category = await this.categoryService.upsertCategory(categoryToSave);
        if (!result) {
            console.log('Error');
        }

        return result;
    }

    @Get(':userId')
    getCategoriesByUserId(@Param('userId') userId): Promise<Category[]> {
        return this.categoryService.getCategoriesByUserId(userId);
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
