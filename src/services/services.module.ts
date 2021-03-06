import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { JwtService } from './jwt.service';
import { CryptService } from './crypt.service';

@Module({
  imports: [],
  providers: [JwtService, CryptService, EmailService],
  exports: [JwtService, CryptService, EmailService],
})
export class ServicesModule { }