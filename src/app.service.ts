import { Injectable } from '@nestjs/common';
import { Expence } from './app.entity';
import { getConnection } from 'typeorm';
import { getRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NewExpence } from './expence.dto';

import * as bcrypt from 'bcrypt';

    const saltRounds = 10;
    const myPlaintextPassword = 's0/\/\P4$$w0rD';

@Injectable()
export class AppService {

  constructor(
    @InjectRepository(Expence)
    private readonly expenceRepository: Repository<Expence>,
  ) {}

  async getExpences() : Promise<Expence[]> {
    return await this.expenceRepository.find();
  }

  async saveNewExpence(newExpence: any): Promise<Expence[]> {
    return await this.expenceRepository.save(newExpence);
  }

  async getExpenceByCategory(category: string) {
    const expence = await getRepository(Expence)
    .createQueryBuilder('Expence')
    .where('Expence.type = :type', { type: category })
    .getMany();

    console.log('response', expence);
    return expence;
  }

  getId(): string {
    const uuidv4 = require('uuid/v4');
    return uuidv4();
  }

  parseDate(dateToparse: string): Date {
    const parsedDate =  dateToparse.split('.');
    const year = parsedDate[2].substring(0, 4);
    const month = parsedDate[1].length === 1 ?
      '0' + parsedDate[1]
      : parsedDate[1];
    const day = parsedDate[0].length === 1 ?
    '0' + parsedDate[0]
    : parsedDate[0];

    const date = new Date(year + '-' + month + '-' + day);
    return date;
  }

  encryptPassword(password: string): boolean {
    let isHashed: boolean;
    bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
      console.log('hash ', hash);
      console.log('hash ', hash);
      isHashed = hash ? true : false;
      
      // Store hash in your password DB.
    });
    return isHashed;
  }

  // hashPassword(password: ) {
  //   bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
  //     console.log('hash ', hash);
  //     // Store hash in your password DB.
  //   });
  // }
}
