
import { Controller, Get, Post, Req, Body } from '@nestjs/common';
import { ApplicationUser } from '../user/user.dto';
import { User } from '../db/entities/user.entity';
import { JwtService } from '../services/jwt.service';
import { CryptService } from '../services/crypt.service';
import { RegistrationException } from '../exceptions/registration.exception';
import { UserService } from '../user/user.service';

@Controller('user')
export class UserController {
    constructor(
        private jwtService: JwtService,
        private userService: UserService,
        private cryptService: CryptService,
    ) { }

    @Post('register')
    async create(@Body() user: ApplicationUser) {
        const userId = this.cryptService.getId();
        console.log('---> userId ', userId);
        console.log('---> create user ', user);
        // return 'This action adds a new cat';
        let newUser: ApplicationUser | User;
        try {
            newUser = await this.userService.createUser(user);
        } catch (error) {
            throw new RegistrationException(error.message);
        }
    }
}
