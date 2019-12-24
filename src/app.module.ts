import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ServicesModule } from './services/services.module';
import { DbModule } from './db/db.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './db/entities/user.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([User]),
		TypeOrmModule,
		UserModule,
		ServicesModule,
		DbModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule { }
