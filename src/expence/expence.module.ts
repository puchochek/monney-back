import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpenceController } from './expence.controller';
import { Expence } from '../db/entities/expence.entity';
import { AppUser } from '../db/entities/user.entity';
import { AppService } from '../app.service';
import { ExpenceService } from './expence.service';
import { DbModule } from 'src/db/db.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Expence]),
    TypeOrmModule.forFeature([AppUser]),
    ExpenceModule,
    DbModule,
  ],
  controllers: [ExpenceController],
  providers: [ExpenceService, AppService],
})
export class ExpenceModule { }
