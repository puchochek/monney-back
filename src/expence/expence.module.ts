import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpenceController } from './expence.controller';
import { Expence } from '../db/entities/expence.entity';
import { AppUser } from '../db/entities/user.entity';
import { Category } from '../db/entities/category.entity';
import { AppService } from '../app.service';
import { ExpenceService } from './expence.service';
import { CategoryService } from '../category/category.service'
import { DbModule } from 'src/db/db.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Expence]),
    TypeOrmModule.forFeature([AppUser]),
    TypeOrmModule.forFeature([Category]),
    ExpenceModule,
    DbModule,
  ],
  controllers: [ExpenceController],
  providers: [ExpenceService, AppService, CategoryService],
})
export class ExpenceModule { }
