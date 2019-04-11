import { Controller } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('expences')
export class AppController {

  constructor(private appService: AppService) { }

}
