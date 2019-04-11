import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserController } from './user/user.controller';
import { AppService } from './app.service';
import { UserService } from './user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expence } from './db/entities/expence.entity';
import { AppUser } from './db/entities/user.entity';
import { UserModule } from './user/user.module';
import { ExpenceModule } from './expence/expence.module';
import { ServicesModule } from './services/services.module';
import { DbModule } from './db/db.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Expence]),
    TypeOrmModule.forFeature([AppUser]),
    UserModule,
    ExpenceModule,
    ServicesModule,
    TypeOrmModule,
    DbModule,
  ],
  controllers: [AppController, UserController],
  providers: [AppService, UserService],
})
export class AppModule { }
