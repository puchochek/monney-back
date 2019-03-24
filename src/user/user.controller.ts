import { Controller, Get, Post, Body, Param, Req } from '@nestjs/common';
import { AppService } from '../app.service';
import { UserService } from './user.service';
import { AppUser } from '../user.entity';
import { User } from '../user.dto';

@Controller('user')
export class UserController {
    constructor(private userService: UserService,
                private appService: AppService) { }

    @Post(':login')
    async hashPassword(@Body() user: User): Promise<AppUser[]>  {
        const userToSave = user;
        // TODO add validation for all params + Validate email and password on frontEnd
        userToSave.id = this.appService.getId();
        userToSave.name = this.userService.validateUserName(user.name);
        userToSave.email = this.userService.validateEmail(user.email);
        userToSave.password = this.userService.hashPassword(user.password);
        const result: User[] = await this.userService.saveNewUser(userToSave);
        if (!result) {
            console.log('Error');
        }
        return result;
    }

}
