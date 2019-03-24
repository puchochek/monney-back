import { Controller, Get, Post, Body, Param, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { Expence } from './app.entity';
import { AppUser } from './user.entity';
import { NewExpence } from './expence.dto';
import { User } from './user.dto';

@Controller('expences')
export class AppController {

  constructor(private appService: AppService) { }

}
