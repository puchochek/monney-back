import { Controller, Get, Post, Body, Param, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { Expence } from './app.entity';
import { NewExpence } from './expence.dto';


@Controller('expences')
export class AppController {
  constructor(private appService: AppService) {}

  // @Get()
  // getHello(): Object {
  //   return this.appService.getData();
  // }

  @Get()
  getExpences(): Promise<Expence[]> {
    return this.appService.getExpences();
  }

 @Get(':category')
 getExpenceByCategory(@Param('category') category): Promise<Expence[]> {
  console.log(`${category}`);

  return this.appService.getExpenceByCategory(category);
 }

  @Post()
  async createNewExpence(@Body() newExpence: NewExpence): Promise<Expence[]> {
    const expenceToSave = newExpence;
    expenceToSave.id = this.appService.getId();
    expenceToSave.date = this.appService.parseDate(newExpence.dateToParse);
    const result: Expence [] = await this.appService.saveNewExpence(expenceToSave);
    if (!result) {
      console.log('Error');
    }
    return result;
  }

  // @Get()
  // findAll(): Promise<Expence[]> {
  //   return this.appService.findAll();
  // }
}
