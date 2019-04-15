import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { JwtService } from './jwt.service';

@Module({
  imports: [],
  providers: [EmailService, JwtService],
  exports: [EmailService, JwtService],
})
export class ServicesModule { }
