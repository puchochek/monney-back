import { Controller, Get, Post, Body, Param, Req, Res, UseGuards } from '@nestjs/common';
import { AppService } from '../app.service';
import { UserService } from './user.service';
import { AppUser } from '../db/entities/user.entity';
import { User } from './user.dto';
import { LoginUserError } from '../errors/login-user';
import { JwtService } from '../services/jwt.service';
import { Connection } from 'typeorm';
import { AuthGuard } from '../auth.guard';
import * as dotenv from 'dotenv';

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
		if (result) {
			const userToUpdate = result;
			userToUpdate.isConfirmed = true;

			const updatedUser = await this.connection
				.getRepository(AppUser)
				.save(userToUpdate);
			return updatedUser;
		}
		// TODO What do I have to return in case of fail?
		//console.log('---> result AUTHORIZED ', result);
	}

	@Post('register')
	async hashPassword(@Body() user: User): Promise<AppUser[]> {
		const userToSave = user;
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

	@Post('avatar/:id')
	saveUserAvatarToCloud(@Req() req, @Res() res,
		@Param('id') id: string) {
		const multer = require('multer')
		const storage = multer.diskStorage({
			destination: function (req, file, cb) {
				cb(null, 'uploads/');
			},
			filename: function (req, file, cb) {
				console.log('---> file ', file);
				cb(null, file.originalname);
			}
		});
		const upload = multer({ storage }).single('avatar');

		upload(req, res, function (err) {
			if (err) {
				console.log('---> err 1 ', err);
				return res.send(err);
			}

			// SEND FILE TO CLOUDINARY
			const cloudinary = require('cloudinary').v2
			console.log('---> ENV ', process.env.CLOUDINARY_CLOUD_NAME, ' ', process.env.CLOUDINARY_API_KEY, ' ', process.env.CLOUDINARY_API_SECRET );
			cloudinary.config({
				cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
				api_key: process.env.CLOUDINARY_API_KEY,
				api_secret: process.env.CLOUDINARY_API_SECRET
			})

			const path = req.file.path;
			console.log('---> path ', path);
			cloudinary.uploader.upload(
				path,
				{ public_id: `avatar/${id}`, tags: `avatar` },
				function (err, image) {
					if (err) {
						console.log('---> err 2 ', err);
						return res.send(err);
					}
					// remove file from server
					const fs = require('fs');
					fs.unlinkSync(path);
					// return image details
					console.log('---> image T ', image);
					res.json(image);
				}
			)
		})
	}

	@Post('update')
	async updateUser(@Req() req,
		@Body() user: any): Promise<AppUser[]> {
		return this.userService.updateUser(user.user);
	}

}
