
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '../services/jwt.service';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private userService: UserService
    ) { }
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        console.log('---> Hello from custom Auth Guard' );
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        const token =
            request.headers && request.headers.authorization && request.headers.authorization.split('Bearer ')[1];
        if (token) {
            console.log('---> AuthGuard token ', token);
        }
        return true;
    }
}