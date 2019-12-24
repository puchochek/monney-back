
import { Controller, Get, Post, Req, Body } from '@nestjs/common';
import { ApplicationUser } from '../user/user.dto';
import { JwtService } from '../services/jwt.service';
import { RegistrationException } from '../exceptions/registration.exception';

@Controller('user')
export class UserController {
    constructor(
        private jwtService: JwtService,
    ) { }

    @Post('register')
    async create(@Body() user: ApplicationUser) {
        const userId = this.jwtService.getId();
        console.log('---> userId ', userId);
        console.log('---> create user ', user);
        // return 'This action adds a new cat';
        // let newUser: ApplicationUser | IUser;
        // try {
        //     user = await this.userService.createUser({
        //         username: username || email,
        //         password,
        //         email,

        //     });
        // } catch (error) {
        //     throw new RegistrationException(error.message);
        // }
    }
}
