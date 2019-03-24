import { Injectable } from '@nestjs/common';
import { AppUser } from '../user.entity';
import { getRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

const saltRounds = 10;

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(AppUser)
        private readonly userRepository: Repository<AppUser>,
      ) {}

    hashPassword(password: string): string {
        console.log('hashPassword ', password, saltRounds);
        const hashedPassword = bcrypt.hashSync(password, saltRounds);
        console.log('hashedPass ', hashedPassword);

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
