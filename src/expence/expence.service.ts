import { Injectable } from '@nestjs/common';
import { Expence } from '../db/entities/expence.entity';
import { getRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ExpenceService {
  constructor(
    @InjectRepository(Expence)
    private readonly expenceRepository: Repository<Expence>,
  ) { }

  async getExpences(): Promise<Expence[]> {
    return await this.expenceRepository.find();
  }

  async saveNewExpence(newExpence: any): Promise<Expence[]> {
    console.log('newExpence ', newExpence);
    return await this.expenceRepository.save(newExpence);
  }

  async getExpenceByCategory(category: string) {
    const expence = await getRepository(Expence)
      .createQueryBuilder('Expence')
      .where('Expence.type = :type', { type: category })
      .getMany();

    return expence;
  }
}
