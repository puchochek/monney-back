import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ServicesModule } from '..//services/services.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../db/entities/user.entity';


// import { JwtService } from '../services/jwt.service';

@Module({
	controllers: [UserController],
	providers: [UserService],
	exports: [UserService],
	imports: [
		TypeOrmModule.forFeature([User]),
		ServicesModule,
	]
})
export class UserModule { }
