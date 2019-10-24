
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from './services/jwt.service';
import { UserService } from './user/user.service';
import { AppUser } from './db/entities/user.entity';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private jwtService: JwtService,
        private userService: UserService
    ) { }

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();

        return this.validateRequest(request);
    }

    validateRequest(request: any): boolean {
        //console.log('---> validateRequest ', request);
        const tokenHttp =
            request.headers && request.headers.authorization && request.headers.authorization.split('Bearer ')[1];
            console.log('---> request.headers.authorization ', request.headers.authorization );
        console.log('---> validateRequest tokenHttp ', tokenHttp);
        if (!tokenHttp) {
            console.log('---> no token return');
            return false;
        }

        const userId = this.jwtService.decodeJwt(tokenHttp).data;
        console.log('---> validateRequest userId ', userId);

        if (!userId) {
            console.log('---> no userId return');
            return false;
        }

        this.userService.getUserById(userId).then(user => {
            console.log('---> user ', user);
            if (!user) {
                console.log('---> no user return');
                return false;
            }
        });

        const isTokenVerified = this.jwtService.verifyJwt(tokenHttp);
        console.log('---> validateRequest isTokenVerified ', isTokenVerified);


        return true;

    }
}