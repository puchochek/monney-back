import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ServicesModule } from '..//services/services.module';
// import { JwtService } from '../services/jwt.service';

@Module({
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
  imports: [ServicesModule]
})
export class UserModule {}
