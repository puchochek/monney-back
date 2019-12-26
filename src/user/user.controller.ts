
import { Controller, Get, Post, UseGuards, Res, Req, Body } from '@nestjs/common';
import { ApplicationUser } from '../user/user.dto';
import { User } from '../db/entities/user.entity';
import { JwtService } from '../services/jwt.service';
import { CryptService } from '../services/crypt.service';
import { RegistrationException } from '../exceptions/registration.exception';
import { UserService } from '../user/user.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
    constructor(
        private jwtService: JwtService,
        private userService: UserService,
        private cryptService: CryptService,
    ) { }

    @Post('register')
    async create(@Body() user: ApplicationUser): Promise<User> {
        console.log('---> create user ', user);
        //temporary commented
        // const isUserInputValid = this.validateUserInput(user);
        // if (!isUserInputValid) {
        //     throw new RegistrationException(`User input is malformed.`);
        // }
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

    @Get('google')
    @UseGuards(AuthGuard('google'))
    googleLogin() {
        /*initiates the Google OAuth2 login flow*/
    }

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleLoginCallback(@Req() req, @Res() res) {
        /* handles the Google OAuth2 callback */
        const expiresIn = '2 hours';
        let jwt: string;
        console.log(' USER CTRL req.user ', req.user);
        const googleAuthUser = {...req.user.googleUser};
        const existedUser = await this.userService.getUserByEmail(googleAuthUser.email);
        console.log('---> existedUser ', existedUser);
        if (existedUser && existedUser.id) {
            jwt = this.jwtService.generateToken(existedUser.id, expiresIn);
        } else {
            const userToSave: User = {
                id: this.cryptService.getId(),
                name: googleAuthUser.name,
                email: googleAuthUser.email,
                isConfirmed: false,
                categories: [],
                transactions: [],
                balanceEdge: 0,
                avatar: googleAuthUser.avatar,
                provider: `google`
            };

            let newUser: User;
            try {
                newUser = await this.userService.createUser(userToSave);
                console.log('---> newUser ', newUser);
                jwt = this.jwtService.generateToken(newUser.id, expiresIn);
            } catch (error) {
                throw new RegistrationException(error.message);
            }

        }
        console.log('jwt ', jwt);
        const successRedirectUrl = `${process.env.CLIENT_REDIRECT_URL}/${jwt}`;
        if (jwt)
            res.redirect(successRedirectUrl);
        else
            res.redirect(process.env.CLIENT_URL);
    }
}
