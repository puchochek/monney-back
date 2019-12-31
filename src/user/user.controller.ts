
import { Controller, Get, Post, UseGuards, Res, Req, Body } from '@nestjs/common';
import { ApplicationUser, LoginUser } from '../user/user.dto';
import { User } from '../db/entities/user.entity';
import { JwtService } from '../services/jwt.service';
import { CryptService } from '../services/crypt.service';
import { RegistrationException } from '../exceptions/registration.exception';
import { LoginException } from '../exceptions/login.exception';
import { UserService } from '../user/user.service';
import { JwtGuard } from '../guards/jwt.guard';
//import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';


@Controller('user')
export class UserController {

    constructor(
        private jwtService: JwtService,
        private userService: UserService,
        private cryptService: CryptService,
    ) { }

    @Post('singin')
    async createUser(@Body() user: ApplicationUser): Promise<User> {
        console.log('---> create user ', user);
        const isUserInputValid = this.validateUserInput(user);
        if (!isUserInputValid) {
            throw new RegistrationException(`User input is malformed.`);
        }
        const userToSave: User = {
            id: this.cryptService.getId(),
            name: user.name,
            password: this.cryptService.hashPassword(user.password),
            email: user.email,
            isConfirmed: user.isConfirmed,
            categories: [],
            transactions: [],
            balanceEdge: 0,
            provider: user.provider
        };
        console.log('---> userToSave ', userToSave);
        let newUser: User;
        try {
            newUser = await this.userService.createUser(userToSave);
        } catch (error) {
            throw new RegistrationException(error.message);
        }
        delete newUser[`password`];
        return newUser;
    }

    @Post('activate')
    async activateUser(@Body() { token }: { token: string }): Promise<User> {
        const userToActivate = await this.userService.getUserByToken(token);
        console.log('---> userToActivate ', userToActivate);
        if (userToActivate) {
            const userToUpdate = { ...userToActivate };
            userToUpdate.isConfirmed = true;
            return this.userService.updateUser(userToUpdate);
        }
    }

    @Post('token')
    async updateUserSession(@Body() { id }: { id: string }): Promise<User> {
        let userById;
        try {
            userById = await this.userService.getUserById(id);
        } catch (error) {
            throw new LoginException(error.message);
        }

        return userById;
    }

    @Post('singup')
    async loginUser(@Body() user: LoginUser): Promise<User> {
        let userByEmailAndPassword;
        try {
            userByEmailAndPassword = await this.userService.getUserByEmailAndPassword(user);
        } catch (error) {
            throw new LoginException(error.message);
        }
        console.log('---> userByEmailAndPassword Controller ', userByEmailAndPassword);
        return userByEmailAndPassword;
    }

    @Get()
    async getUserByToken(@Req() request: Request): Promise<User> {
        let token: string;
        if (request.headers && request.headers.authorization && request.headers.authorization.split('Bearer ')[1]) {
            token = request.headers && request.headers.authorization && request.headers.authorization.split('Bearer ')[1]
        }
        console.log('---> getUserByToken token ', token);
        let userByToken: User;
        try {
            userByToken = await this.userService.getUserByToken(token);
        } catch (error) {
            throw new LoginException(error.message);
        }
        console.log('---> getUserByToken controller ', userByToken);
        return userByToken;
    }

    validateUserInput(user: ApplicationUser): boolean {
        const usernameRegexp = new RegExp('[0-9a-zA-Z]{3,30}');
        const emailRegexp = new RegExp(
            '^([a-zA-Z0-9_\\-.]+)@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.)|(([a-zA-Z0-9-]+\\.)+))([a-zA-Z]{2,4}|[0-9' +
            ']{1,3})(\\]?)$',
        );
        const passwordRegexp = new RegExp('[0-9a-zA-Z]{6,30}');

        const isPasswordValid = passwordRegexp.test(user.password);
        const isEmailValid = emailRegexp.test(user.email);
        const isUsernameValid = usernameRegexp.test(user.name);

        return isPasswordValid && isEmailValid && isUsernameValid ? true : false;
    }

}
