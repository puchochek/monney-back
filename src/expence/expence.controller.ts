import { Controller, Get, Post, Body, Param, Req } from '@nestjs/common';
import { AppService } from '../app.service';
import { ExpenceService } from './expence.service';
import { CategoryService } from '../category/category.service'
import { Expence } from '../db/entities/expence.entity';
import { Category } from '../db/entities/category.entity';
import { NewExpence } from './expence.dto';

@Controller('expence')
export class ExpenceController {
	constructor(
		private appService: AppService,
		private expenceService: ExpenceService,
		private categoryService: CategoryService,
	) { }

	@Get()
	getExpences(): Promise<Expence[]> {
		return this.expenceService.getExpences();
	}

	@Get(':category')
	getExpenceByCategory(@Param('category') category): Promise<Expence[]> {
		return this.expenceService.getExpenceByCategory(category);
	}

	@Post()
	async createNewExpence(@Body() newExpence: NewExpence): Promise<Expence> {
		console.log('---> newExpence ', newExpence );
		//let incomeCategory: Category;
		const expenceToSave = new Expence;
		expenceToSave.id = this.appService.getId();
		expenceToSave.isDeleted = false;
		expenceToSave.user = newExpence.userId;
		expenceToSave.date = new Date(newExpence.date);
		expenceToSave.sum = newExpence.sum;
		expenceToSave.comment = newExpence.comment;
console.log('---> !newExpence.categoryId ', newExpence.categoryId === 'undefined');
		if (newExpence.categoryId === 'undefined') {
			console.log('---> 1');
			const incomeCategoryFuture = await this.categoryService.saveIncomeCategory(newExpence.userId);
			const incomeCategory = <Category>incomeCategoryFuture;
			expenceToSave.category = incomeCategory.id;
		} else {
			console.log('---> 2');
			expenceToSave.category = newExpence.categoryId;
		}


		const result: Expence = await this.expenceService.saveNewExpence(expenceToSave);
		if (!result) {
			console.log('Error');
		}
		return result;
	}
}
