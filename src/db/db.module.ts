import * as url from 'url';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

// Get environment variable from .env file
dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('Set DATABASE_URL environment variable!');
}

const dbUrl = url.parse(process.env.DATABASE_URL);

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: dbUrl.host.split(':')[0],
      port: +dbUrl.port,
      username: dbUrl.auth.split(':')[0],
      password: dbUrl.auth.split(':')[1],
      database: dbUrl.path.split('/')[1],
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      ssl: true,
    }),
  ],
})
export class DbModule { }
