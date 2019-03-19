import { Injectable } from '@nestjs/common';
import { Expence } from './app.entity';
import { AppUser } from './user.entity';
import { getConnection } from 'typeorm';
import { getRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NewExpence } from './expence.dto';
import { User } from './user.dto';

import * as bcrypt from 'bcrypt';

const saltRounds = 10;

@Injectable()
export class AppService {

  constructor(
    @InjectRepository(Expence)
    private readonly expenceRepository: Repository<Expence>,
    @InjectRepository(AppUser)
    private readonly userRepository: Repository<AppUser>,
  ) {}

  async getExpences(): Promise<Expence[]> {
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

  hashPassword(password: string): string {
    console.log('hashPassword ', password, saltRounds);
    const hashedPassword = bcrypt.hashSync(password, saltRounds);
    console.log('hashedPass ', hashedPassword)

    return hashedPassword ? hashedPassword : 'Error';
  }

  validateUserName(name: string): string {
    return name.length === 0 ? 'User' : name;
  }

  validateEmail(email: string): string {
    const expression = /\S+@\S+/;
    // TODO What to do if email is invalid?
    console.log('valid email ', expression.test(String(email).toLowerCase()))
    return expression.test(String(email).toLowerCase()) ? email : 'Error';
  }

  async saveNewUser(user: any): Promise<AppUser[]> {
    return await this.userRepository.save(user);
    // return [user];
  }
}
