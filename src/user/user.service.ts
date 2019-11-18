import { Injectable } from '@nestjs/common';
import { AppUser } from '../db/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { EmailService } from '../services/email.service';
import { User } from './user.dto';

const saltRounds = 10;

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(AppUser) private readonly userRepository: Repository<AppUser>,
		private emailService: EmailService,
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

	async saveNewUser(user: any): Promise<AppUser[]> {
		const createdUser = await this.userRepository.save(user);
		let emailToSendAuth: string;
		let userId: string;

		if (createdUser) {
			emailToSendAuth = createdUser.email;
			userId = createdUser.id;
		}
		const emailSendResult = await this.emailService.sendRegistrationMail(emailToSendAuth, userId);

		return createdUser;
	}

	async getUserById(userId: string): Promise<AppUser> {
		const USER_FIELDS = [
			'app_user.id',
			'app_user.name',
			'app_user.email',
			'app_user.password',
			'app_user.isConfirmed',
			'app_user.avatar',
			'app_user.createdAt',
			'app_user.updatedAt',
		];

		return await this.userRepository
			.createQueryBuilder('app_user')
			.select(USER_FIELDS)
			.leftJoinAndSelect("app_user.categories", "category", "category.isActive = true")
			.leftJoinAndSelect("app_user.transactions", "transaction", "transaction.isDeleted = false")
			.where({ id: userId })
			.getOne();
	}

	async getUserByEmail(user: User): Promise<AppUser> {
		const USER_FIELDS = [
			'app_user.id',
			'app_user.name',
			'app_user.email',
			'app_user.password',
			'app_user.isConfirmed',
			'app_user.avatar',
			'app_user.createdAt',
			'app_user.updatedAt',
		];
		const userByEmail = await this.userRepository
			.createQueryBuilder('app_user')
			.select(USER_FIELDS)
			.leftJoinAndSelect("app_user.categories", "category", "category.isActive = true AND category.isIncome = false")
			.leftJoinAndSelect("app_user.transactions", "transaction")
			.where({ email: user.email })
			.getOne();
		if (this.comparePasswords(user.password, userByEmail.password)) {
			return userByEmail;
		}

		return null;
	}

	async updateUser(user: User[]): Promise<AppUser[]> {

		return await this.userRepository.save(user);
	}

	// async getUsers(): Promise<AppUser[]> {
	// 	return await this.userRepository.find();
	// }

}
