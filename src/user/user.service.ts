import { Injectable } from '@nestjs/common';
import { ApplicationUser } from '../user/user.dto';
import { User } from '../db/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailService } from '../services/email.service';
import { EmailException } from '../exceptions/email.exception';

@Injectable()
export class UserService {
    constructor(
		@InjectRepository(User) private readonly userRepository: Repository<User>,
		private emailService: EmailService,
		//private jwtService: JwtService,
	) { }

    async createUser(user: User): Promise<User> {
        const createdUser = await this.userRepository.save(user);
        let emailSendResult;
        try {
            emailSendResult = await this.emailService.sendRegistrationMail(createdUser);
        } catch(error) {
            throw new EmailException(`Can't send email: ${error.message}`);
        }
		return createdUser;
    }
}
