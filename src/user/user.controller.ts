import { Controller, Get, Post, Body, Param, Req } from '@nestjs/common';
import { AppService } from '../app.service';
import { UserService } from './user.service';
import { AppUser } from '../user.entity';
import { User } from '../user.dto';
import { LoginUserError } from '../errors/login-user';

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
        //const result: User[] = await this.userService.saveNewUser(userToSave);

        let result: User[];
        try {
            result = await this.userService.saveNewUser(userToSave);
        } catch {
            console.log('no result');
            throw new LoginUserError('Duplicate value. A User with such email address already exists.');
        }
        console.log('result ', result);

        //TEST
        this.getUsers();
        return result;
    }

    async getUsers(): Promise<AppUser[]> {
        console.log('Users ', await this.userService.getUsers());
        return await this.userService.getUsers();
    }

}
