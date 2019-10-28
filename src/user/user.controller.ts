import { Controller, Get, Post, Body, Param, Req, UseGuards } from '@nestjs/common';
import { AppService } from '../app.service';
import { UserService } from './user.service';
import { AppUser } from '../db/entities/user.entity';
import { User } from './user.dto';
import { LoginUserError } from '../errors/login-user';
import { JwtService } from '../services/jwt.service';
import { Connection } from 'typeorm';
import { AuthGuard } from '../auth.guard';

@Controller('user')
export class UserController {

	constructor(
		private userService: UserService,
		private appService: AppService,
		private jwtService: JwtService,
		private readonly connection: Connection,
	) { }

	@Post('token')
	async activateUser(@Body() { token }: { token: string }): Promise<AppUser> {
		const userId = this.jwtService.decodeJwt(token).data;
		console.log('userId ', userId);
		const USER_FIELDS = [
			'app_user.id',
			'app_user.name',
			'app_user.email',
			'app_user.password',
			'app_user.isConfirmed',
		];

		const result = await this.connection
			.getRepository(AppUser)
			.createQueryBuilder('app_user')
			.select(USER_FIELDS)
			.where({ id: userId })
			.getOne();
		console.log('result ', result);
		if (result) {
			const userToUpdate = result;
			userToUpdate.isConfirmed = true;

			const updatedUser = await this.connection
				.getRepository(AppUser)
				.save(userToUpdate);
			console.log('----> updatedUser ', updatedUser);
			return updatedUser;
		}
		// TODO What do I have to return in case of fail?
		//console.log('---> result AUTHORIZED ', result);
	}

	@Post('register')
	async hashPassword(@Body() user: User): Promise<AppUser[]> {
		const userToSave = user;
		// TODO add validation for all params + Validate email and password on frontEnd
		userToSave.id = this.appService.getId();
		userToSave.name = this.userService.validateUserName(user.name);
		userToSave.email = this.userService.validateEmail(user.email);
		userToSave.password = this.userService.hashPassword(user.password);
		userToSave.isConfirmed = false;

		let result: AppUser[];
		try {
			result = await this.userService.saveNewUser(userToSave);
		} catch {
			console.log('no result');
			throw new LoginUserError('Oops. Something is wrong. Please, try again.');
		}
		console.log('---> result REGISTRED', result);

		return result;
	}

	@Post('autorize')
	async autorizeUser(@Req() req,
		@Body() user: User): Promise<AppUser> {
		return this.userService.getUserByPassword(user);
	}

	@Get('user-by-id/:id')
	@UseGuards(AuthGuard)
	getUserById(@Param('id') id: string): Promise<AppUser> {
		console.log('---> getUserById ', id);
		return this.userService.getUserById(id);
	}
	/* Returns nothing but set appropriate header*/
	@Get('user-token/:userId')
	getActivatedUserToken(@Param('userId') userId: string) {
		console.log('---> user-token userId ', userId);
	}

}
