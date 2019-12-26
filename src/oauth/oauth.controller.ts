import { Controller, Get, Post, UseGuards, Res, Req, Request, Body } from '@nestjs/common';
import { User } from '../db/entities/user.entity';
import { JwtService } from '../services/jwt.service';
import { CryptService } from '../services/crypt.service';
import { RegistrationException } from '../exceptions/registration.exception';
import { UserService } from '../user/user.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('oauth')
export class OauthController {
    constructor(
        private userService: UserService,
        private cryptService: CryptService,
        private jwtService: JwtService,
    ) { }

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
        const googleAuthUser = { ...req.user.googleUser };
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
        const successRedirectUrl = `${process.env.CLIENT_URL}/auth/${jwt}`;
        if (jwt)
            res.redirect(successRedirectUrl);
        else
            res.redirect(process.env.CLIENT_URL);
    }
}