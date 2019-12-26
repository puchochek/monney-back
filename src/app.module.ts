import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServicesModule } from './services/services.module';
import { DbModule } from './db/db.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './db/entities/user.entity';
import { StrategiesModule } from './strategies/strategies.module';
import { from } from 'rxjs';
import { CategoryModule } from './category/category.module';
import { TransactionModule } from './transaction/transaction.module';
import { UserModule } from './user/user.module';
import { OauthModule } from './oauth/oauth.module';
import { UserController } from './user/user.controller';
import { TransactionController } from './transaction/transaction.controller';
import { CategoryController } from './category/category.controller';
import { OauthController } from './oauth/oauth.controller';
import { JwtMiddleware } from './jwt.middleware';

@Module({
	imports: [
		TypeOrmModule.forFeature([User]),
		TypeOrmModule,
		UserModule,
		ServicesModule,
		DbModule,
		StrategiesModule,
		CategoryModule,
		TransactionModule,
		OauthModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule  {}
// export class AppModule implements NestModule {
// 	configure(consumer: MiddlewareConsumer) {
// 		consumer
// 			.apply(JwtMiddleware)
// 			.exclude(
// 				{ path: 'user', method: RequestMethod.POST },
// 				{ path: '/oauth/google', method: RequestMethod.GET }
// 			)
// 			.forRoutes(UserController, TransactionController, CategoryController, OauthController);
// 	}
// }
