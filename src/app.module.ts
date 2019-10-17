import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserController } from './user/user.controller';
import { CategoryController } from './category/category.controller';
import { AppService } from './app.service';
import { UserService } from './user/user.service';
import { CategoryService } from './category/category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expence } from './db/entities/expence.entity';
import { AppUser } from './db/entities/user.entity';
import { Category } from './db/entities/category.entity';
import { UserModule } from './user/user.module';
import { ExpenceModule } from './expence/expence.module';
import { ServicesModule } from './services/services.module';
import { DbModule } from './db/db.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Expence]),
    TypeOrmModule.forFeature([AppUser]),
    TypeOrmModule.forFeature([Category]),
    UserModule,
    ExpenceModule,
    ServicesModule,
    TypeOrmModule,
    DbModule,
    CategoryModule,
  ],
  controllers: [AppController, UserController, CategoryController],
  providers: [AppService, UserService,CategoryService],
})
export class AppModule { }
