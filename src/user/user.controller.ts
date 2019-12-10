import { Controller, Get, Post, Body, Param, Req, Res, UseGuards } from '@nestjs/common';
import { AppService } from '../app.service';
import { UserService } from './user.service';
import { AppUser } from '../db/entities/user.entity';
import { User } from './user.dto';
import { LoginUserError } from '../errors/login-user';
import { JwtService } from '../services/jwt.service';
import { AuthGuard } from '../auth.guard';
import { Category } from '../db/entities/category.entity';
import { Request } from 'express';
//import { JwtService } from '../services/jwt.service';

@Controller('user')
export class UserController {

	constructor(
		private userService: UserService,
		private appService: AppService,
		private jwtService: JwtService,
	) { }

	@Post('token')
	async activateUser(@Body() { token }: { token: string }): Promise<AppUser[]> {
		const userToActivate = await this.userService.getUnconfirmedUserByToken(token);
		console.log('---> activateUser ', userToActivate);
		if (userToActivate) {
			const userToUpdate = {...userToActivate};
			userToUpdate.isConfirmed = true;
			return this.userService.updateUser([userToUpdate]);
		}
		// TODO What do I have to return in case of fail?
	}

	@Post('register')
	async hashPassword(@Body() user: User): Promise<AppUser[]> {
		console.log('---> register user ', user);
		const userToSave = user;
		userToSave.id = this.appService.getId();
		userToSave.name = this.userService.validateUserName(user.name);
		userToSave.email = this.userService.validateEmail(user.email);
		userToSave.password = this.userService.hashPassword(user.password);
		userToSave.theme = user.theme;
		userToSave.isConfirmed = false;
		userToSave.balanceEdge = 0;

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
		return this.userService.getUserByEmail(user);
	}

	@Get('user-by-token')
	@UseGuards(AuthGuard)
	getUserByToken(@Req() request: Request): Promise<AppUser> {
		let token: string;
        let userId: string;
        if (request.headers && request.headers.authorization && request.headers.authorization.split('Bearer ')[1]) {
            token = request.headers && request.headers.authorization && request.headers.authorization.split('Bearer ')[1]
        }
        if (token) {
            userId = this.jwtService.verifyJwt(token).data;
        }
		console.log('---> getUserByToken ', token);
		return this.userService.getUserByToken(token);
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

	@Post('update')
	async updateUser(@Req() req,
		@Body() user: any): Promise<AppUser[]> {
		return this.userService.updateUser(user.user);
	}

}
