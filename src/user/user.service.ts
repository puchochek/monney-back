import { Injectable } from '@nestjs/common';
import { AppUser } from '../db/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { EmailService } from '../services/email.service';
import { User } from './user.dto';
import { USER_FIELDS } from '../db/scopes/User';
import { JwtService } from '../services/jwt.service';
import { Category } from 'src/db/entities/category.entity';

const saltRounds = 10;

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(AppUser) private readonly userRepository: Repository<AppUser>,
		private emailService: EmailService,
		private jwtService: JwtService,
	) { }

	hashPassword(password: string): string {
		const hashedPassword = bcrypt.hashSync(password, saltRounds);

		return hashedPassword ? hashedPassword : 'Error';
	}

	comparePasswords(passwordToCompare: string, selectedUserPassword: string): boolean {
		return bcrypt.compareSync(passwordToCompare, selectedUserPassword);
	}

	validateUserName(name: string): string {
		return name ? name : 'User';
	}

	validateEmail(email: string): string {
		const expression = /\S+@\S+/;
		// TODO What to do if email is invalid?
		return expression.test(String(email).toLowerCase()) ? email : 'Error';
	}

	async createNewUser(user: any): Promise<AppUser> {
		const createdUser = await this.userRepository.save(user);
		console.log('---> createdUser ', createdUser);
		let emailToSendAuth: string;
		let userId: string;

		if (createdUser) {
			emailToSendAuth = createdUser.email;
			userId = createdUser.id;
		}
		const emailSendResult = await this.emailService.sendRegistrationMail(emailToSendAuth, userId);

		return createdUser;
	}

	async getUserByToken(token: string): Promise<AppUser> {
		const userId = this.jwtService.decodeJwt(token).data;
		return await this.userRepository
			.createQueryBuilder('app_user')
			.select(USER_FIELDS)
			.leftJoinAndSelect("app_user.categories", "category", "category.isActive = true")
			.leftJoinAndSelect("app_user.transactions", "transaction", "transaction.isDeleted = false")
			.where("app_user.id = :id AND app_user.isConfirmed = true", { id: userId })
			.getOne();
	}

	async getUserByEmail(user: User): Promise<AppUser> {
		const userByEmail = await this.userRepository
			.createQueryBuilder('app_user')
			.select(USER_FIELDS)
			.leftJoinAndSelect("app_user.categories", "category", "category.isActive = true")
			.leftJoinAndSelect("app_user.transactions", "transaction")
			.where("app_user.email = :email AND app_user.isConfirmed = true", { email: user.email })
			.getOne();
			console.log('---> getUserByEmail ', userByEmail);
		if (this.comparePasswords(user.password, userByEmail.password)) {
			return userByEmail;
		}

		return null;
	}

	async getUnconfirmedUserByToken(token: string): Promise<AppUser> {
		const userId = this.jwtService.decodeJwt(token).data;
		return await this.userRepository
			.createQueryBuilder('app_user')
			.select(USER_FIELDS)
			.leftJoinAndSelect("app_user.categories", "category", "category.isActive = true")
			.leftJoinAndSelect("app_user.transactions", "transaction", "transaction.isDeleted = false")
			.where("app_user.id = :id", { id: userId })
			.getOne();
	}

	async getUserById(userId: string): Promise<AppUser> {
		return await this.userRepository
			.createQueryBuilder('app_user')
			.select(USER_FIELDS)
			.leftJoinAndSelect("app_user.categories", "category", "category.isActive = true")
			.leftJoinAndSelect("app_user.transactions", "transaction", "transaction.isDeleted = false")
			.where("app_user.id = :id", { id: userId })
			.getOne();
	}

	async updateUser(user: any): Promise<AppUser> {

		return await this.userRepository.save(user);
	}
}
