import { Injectable } from '@nestjs/common';
import { ApplicationUser } from '../user/user.dto';
import { User } from '../db/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


@Injectable()
export class UserService {
    constructor(
		@InjectRepository(User) private readonly userRepository: Repository<User>,
		//private emailService: EmailService,
		//private jwtService: JwtService,
	) { }

    async createUser(user: ApplicationUser): Promise<ApplicationUser | User> {
        const createdUser = await this.userRepository.save(user);
		// let emailToSendAuth: string;
		// let userId: string;

		// if (createdUser) {
		// 	emailToSendAuth = createdUser.email;
		// 	userId = createdUser.id;
		// }
		// const emailSendResult = await this.emailService.sendRegistrationMail(emailToSendAuth, userId);

		return createdUser;

    }
}
