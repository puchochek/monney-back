import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserController } from './user/user.controller';
import { CategoryController } from './category/category.controller';
import { AppService } from './app.service';
import { UserService } from './user/user.service';
import { CategoryService } from './category/category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './db/entities/transaction.entity';
import { AppUser } from './db/entities/user.entity';
import { Category } from './db/entities/category.entity';
import { UserModule } from './user/user.module';
import { ServicesModule } from './services/services.module';
import { DbModule } from './db/db.module';
import { CategoryModule } from './category/category.module';
import { JwtMiddleware } from './jwt.middleware';
import { TransactionModule } from './transaction/transaction.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    TypeOrmModule.forFeature([AppUser]),
    TypeOrmModule.forFeature([Category]),
    UserModule,
    ServicesModule,
    TypeOrmModule,
    DbModule,
    CategoryModule,
    TransactionModule,
    // JwtMiddleware
  ],
  controllers: [AppController, UserController, CategoryController],
  providers: [AppService, UserService, CategoryService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware)
      // .exclude(
        // { path: 'user/autorize', method: RequestMethod.ALL },
        // { path: 'user/token', method: RequestMethod.ALL },
        // { path: 'user/register', method: RequestMethod.ALL },
      // )
      .forRoutes({
        path: '*', method: RequestMethod.ALL
      });
  }
}
