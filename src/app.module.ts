import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserController } from './user/user.controller';
import { AppService } from './app.service';
import { UserService } from './user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { Expence } from './app.entity';
import { AppUser } from './user.entity';
import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { getConnection } from 'typeorm';
import { UserModule } from './user/user.module';
import { ExpenceModule } from './expence/expence.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'ec2-54-75-245-94.eu-west-1.compute.amazonaws.com',
      port: 5432,
      username: 'mytyguvolitakw',
      password: '764e1848c77e2fb19c03b5ff27c7db61e0429858dd8eacc2468ea679267afc43',
      database: 'd8o82eifos92ke',
      //postgres://mytyguvolitakw:764e1848c77e2fb19c03b5ff27c7db61e0429858dd8eacc2468ea679267afc43@ec2-54-75-245-94.eu-west-1.compute.amazonaws.com:5432/d8o82eifos92ke
      entities: [
        __dirname + '/../**/*.entity{.ts,.js}',
      ],
      extra: {
        ssl: true,
      },
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Expence]),
    TypeOrmModule.forFeature([AppUser]),
    UserModule,
    ExpenceModule,
  ],
  controllers: [AppController, UserController],
  providers: [AppService, UserService],
})
export class AppModule { }
