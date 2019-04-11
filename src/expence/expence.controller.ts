import { Controller, Get, Post, Body, Param, Req } from '@nestjs/common';
import { AppService } from '../app.service';
import { ExpenceService } from './expence.service';
import { Expence } from '../db/entities/expence.entity';
import { NewExpence } from './expence.dto';

@Controller('expence')
export class ExpenceController {
  constructor(
    private appService: AppService,
    private expenceService: ExpenceService,
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
  async createNewExpence(@Body() newExpence: NewExpence): Promise<Expence[]> {
    const expenceToSave = newExpence;
    expenceToSave.id = this.appService.getId();
    expenceToSave.date = this.appService.parseDate(newExpence.dateToParse);
    const result: Expence[] = await this.expenceService.saveNewExpence(expenceToSave);
    if (!result) {
      console.log('Error');
    }
    return result;
  }
}
