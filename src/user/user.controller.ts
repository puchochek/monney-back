import { Controller, Get, Post, Body, Param, Req, Res, UseGuards, Patch } from '@nestjs/common';
import { AppService } from '../app.service';
import { UserService } from './user.service';
import { AppUser } from '../db/entities/user.entity';
import { User } from './user.dto';
import { LoginUserError } from '../errors/login-user';
import { JwtService } from '../services/jwt.service';
import { AuthGuard } from '../auth.guard';
import { Category } from '../db/entities/category.entity';
import { Request } from 'express';
import { AuthorizationException } from '../exceptions/authorization.exception';
import { UserException } from '../exceptions/user.exception';
//import { JwtService } from '../services/jwt.service';

@Controller('user')
export class UserController {

	constructor(
		private userService: UserService,
		private appService: AppService,
		private jwtService: JwtService,
	) { }

	@Get('token')
	@UseGuards(AuthGuard)
	async getUserByToken(@Req() request: Request): Promise<AppUser> {
		let token: string;
		if (request.headers && request.headers.authorization && request.headers.authorization.split('Bearer ')[1]) {
			token = request.headers && request.headers.authorization && request.headers.authorization.split('Bearer ')[1]
		}

		let userByToken: AppUser;
		try {
			userByToken = await this.userService.getUserByToken(token);
			console.log('---> userByToken ', userByToken);
		} catch (error) {
			console.log('get user error ', error);
			throw new UserException(`${error}`);
		}
		return userByToken;
	}

	@Post()
	async registerUser(@Body() user: User): Promise<AppUser> {
		console.log('---> register user ', user);
		const userToSave = user;
		userToSave.id = this.appService.getId();
		userToSave.name = this.userService.validateUserName(user.name);
		userToSave.email = this.userService.validateEmail(user.email);
		userToSave.password = this.userService.hashPassword(user.password);
		userToSave.theme = user.theme;
		userToSave.isConfirmed = false;
		userToSave.balanceEdge = 0;

		let result: AppUser;
		try {
			result = await this.userService.createNewUser(userToSave);
			const token = this.jwtService.generateToken(result.id, `2 hours`);
			result.temporaryToken = `Bearer ${token}`;
		} catch (error) {
			console.log('login error ', error);
			const isDuplicateEmail = error.message.includes(`duplicate key value violates unique constraint`) ? true : false;
			const message = isDuplicateEmail ? `User with such an email already exists.` : `Login failed. Please, try again.`;
			throw new AuthorizationException(message);
		}
		console.log('---> user REGISTRED', result);

		return result;
	}

	@Post('activate')
	async activateUser(@Body() { token }: { token: string }): Promise<AppUser> {
		const userToActivate = await this.userService.getUnconfirmedUserByToken(token);
		if (userToActivate) {
			const userToUpdate = { ...userToActivate };
			userToUpdate.isConfirmed = true;
			return this.userService.updateUser(userToUpdate);
		}
	}

	@Post('autorize')
	async autorizeUser(@Req() req,
		@Body() user: User): Promise<AppUser> {
		let authorisedUser: AppUser;
		try {
			authorisedUser = await this.userService.getUserByEmail(user);
		} catch (error) {
			throw new AuthorizationException(`Invalid email or password. Please, try again.`);
		}
		const token = this.jwtService.generateToken(authorisedUser.id, `7 days`);
		authorisedUser.temporaryToken = `Bearer ${token}`;
		return authorisedUser;
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
				cb(null, file.originalname);
			}
		});
		const upload = multer({ storage }).single('avatar');

		upload(req, res, function (err) {
			if (err) {
				return res.send(err);
			}

			// SEND FILE TO CLOUDINARY
			const cloudinary = require('cloudinary').v2
			cloudinary.config({
				cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
				api_key: process.env.CLOUDINARY_API_KEY,
				api_secret: process.env.CLOUDINARY_API_SECRET
			})

			const path = req.file.path;
			cloudinary.uploader.upload(
				path,
				{ public_id: `avatar/${id}`, tags: `avatar` },
				function (err, image) {
					if (err) {
						return res.send(err);
					}
					// remove file from server
					const fs = require('fs');
					fs.unlinkSync(path);
					// return image details
					res.json(image);
				}
			)
		})
	}

	@Patch()
	async updateUser(@Req() request,
		@Body() userToUpdate: any): Promise<AppUser> {
		console.log('---> userToUpdate ', userToUpdate);
		return await this.userService.updateUser(userToUpdate);
	}
}
