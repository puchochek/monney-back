import { Module } from '@nestjs/common';
//import { EmailService } from './email.service';
import { JwtService } from './jwt.service';

@Module({
  imports: [],
  providers: [JwtService],
  exports: [JwtService],
})
export class ServicesModule { }