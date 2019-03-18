import { Controller, Get, Post, Body, Param, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { Expence } from './app.entity';
import { NewExpence } from './expence.dto';
import { User } from './user.dto';

@Controller('expences')
export class AppController {

  constructor(private appService: AppService) { }

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

  @Post(':login')
  async hashPassword(@Body() password: User): Promise<boolean> {
    console.log('post with param');
    let res: boolean;
    const result: Expence[] = await this.appService.saveNewExpence(password);
    if (!result) {
      console.log('Error');
      res = false;
    }
    else res = true;
    return res;
  }

  @Post()
  async createNewExpence(@Body() newExpence: NewExpence): Promise<Expence[]> {
    console.log('post without param');
    const expenceToSave = newExpence;
    expenceToSave.id = this.appService.getId();
    expenceToSave.date = this.appService.parseDate(newExpence.dateToParse);
    const result: Expence[] = await this.appService.saveNewExpence(expenceToSave);
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
