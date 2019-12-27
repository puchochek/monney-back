
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '../services/jwt.service';
import { Observable } from 'rxjs';

@Injectable()
export class JwtGuard implements CanActivate {
    constructor(
        private jwtService: JwtService
    ) { }
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();

        const token =
            request.headers && request.headers.authorization && request.headers.authorization.split('Bearer ')[1];

        let jwtDecoded: string;
        if (token) {
            jwtDecoded = this.jwtService.decodeJwt(token).data;
        }
        console.log('---> JwtGuard canActivate token ', jwtDecoded);
        return jwtDecoded ? true : false;
    }
}