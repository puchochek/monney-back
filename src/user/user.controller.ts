
import { Controller, Get, Post, Req, Body } from '@nestjs/common';
import { ApplicationUser } from '../user/user.dto';
import { JwtService } from '../services/jwt.service';

@Controller('user')
export class UserController {
    constructor(
        private jwtService: JwtService,
    ) { }

    @Post()
    async create(@Body() user: ApplicationUser) {
        const userId = this.jwtService.getId();
        console.log('---> userId ', userId);
        console.log('---> create user ', user);
        return 'This action adds a new cat';
    }
}
