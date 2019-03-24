import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpenceController } from './expence.controller';
import { Expence } from '../app.entity';
import { AppUser } from '../user.entity';
import { AppService } from '../app.service';
import { ExpenceService } from './expence.service';


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
        ExpenceModule,
      ],
      controllers: [ExpenceController],
      providers: [ExpenceService, AppService],
})
export class ExpenceModule {}
