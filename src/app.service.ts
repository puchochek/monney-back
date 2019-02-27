import { Injectable } from '@nestjs/common';
import { Expence } from './app.entity';
import { getConnection } from 'typeorm';
import { getRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NewExpence } from './expence.dto';

@Injectable()
export class AppService {

  constructor(
    @InjectRepository(Expence)
    private readonly expenceRepository: Repository<Expence>,
  ) {}

  async getExpences() : Promise<Expence[]> {
    return await this.expenceRepository.find();
  }

  async saveNewExpence(newExpence: any) : Promise<Expence[]> {
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
}
