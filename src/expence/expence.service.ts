import { Injectable } from '@nestjs/common';
import { Expence } from '../app.entity';
import { AppUser } from '../user.entity';
import { getConnection } from 'typeorm';
import { getRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NewExpence } from '../expence.dto';
import { User } from '../user.dto';

@Injectable()
export class ExpenceService {
    constructor(
        @InjectRepository(Expence)
        private readonly expenceRepository: Repository<Expence>,
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
}
