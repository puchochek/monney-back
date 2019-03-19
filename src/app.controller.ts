import { Controller, Get, Post, Body, Param, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { Expence } from './app.entity';
import { AppUser } from './user.entity';
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
  async hashPassword(@Body() user: User): Promise<AppUser[]>  {
    const userToSave = user;
    // TODO add validation for all params
    userToSave.id = this.appService.getId();
    userToSave.name = this.appService.validateUserName(user.name);
    userToSave.email = user.email;
    userToSave.password = this.appService.hashPassword(user.password);
    const result: User[] = await this.appService.saveNewUser(userToSave);
    if (!result) {
      console.log('Error');
    }
    return result;
  }

  @Post()
  async createNewExpence(@Body() newExpence: NewExpence): Promise<Expence[]> {
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
