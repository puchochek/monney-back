import { Injectable } from '@nestjs/common';
import { ApplicationUser } from '../user/user.dto';
import { User } from '../db/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailService } from '../services/email.service';
import { EmailException } from '../exceptions/email.exception';
import { CryptService } from '../services/crypt.service';
import { JwtService } from '../services/jwt.service';
import { USER_FIELDS } from '../db/scopes/User';

@Injectable()
export class UserService {
    GOOGLE_PROVIDER: string = `google`;
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private emailService: EmailService,
        private cryptService: CryptService,
        private jwtService: JwtService
    ) { }

    async createUser(user: User): Promise<User> {
        const createdUser = await this.userRepository.save(user);

        if (createdUser.provider !== this.GOOGLE_PROVIDER) {
            let emailSendResult;
            try {
                emailSendResult = await this.emailService.sendRegistrationMail(createdUser);
            } catch (error) {
                throw new EmailException(`Can't send email: ${error.message}`);
            }
        }

        return createdUser;
    }

    async getUserByEmail(email: string): Promise<User> {
        console.log('---> email ', email);
        const userByEmail = await this.userRepository
            .createQueryBuilder('user')
            .select(USER_FIELDS)
            .leftJoinAndSelect("user.categories", "category", "category.isDeleted = false")
            .leftJoinAndSelect("user.transactions", "transaction")
            .where("user.email = :email", { email: email })
            .getOne();
        // const isPassvordConfirmed = userByEmail.password ? this.cryptService.comparePasswords(user.password, userByEmail.password) : true;

        // let userToReturn: User;
        // if (isPassvordConfirmed) {
        //     userToReturn = { ...userByEmail };
        // }
        console.log('---> getUserByEmail ', userByEmail);
        return userByEmail;
    }

    async getUserByToken(token: string): Promise<User> {
        const userId = this.jwtService.decodeJwt(token).data;
        const userByToken = await this.userRepository
        .createQueryBuilder('user')
        .select(USER_FIELDS)
        .leftJoinAndSelect("user.categories", "category", "category.isDeleted = false")
        .leftJoinAndSelect("user.transactions", "transaction", "transaction.isDeleted = false")
        .where("user.id = :id", { id: userId })
        .getOne();
        console.log('---> getUserByToken ', userByToken );
        return userByToken;
    }

    async updateUser(user: User): Promise<User> {

        return await this.userRepository.save(user);
    }
}
