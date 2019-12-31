
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtService } from './/services/jwt.service';
import { UserService } from './user/user.service';
import { LoginUser } from './user/user.dto';
import { User } from './db/entities/user.entity';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
    private NO_TOKEN_URL: string = `/user/singup`;
    private EXPIRES_IN: string = `7 days`;

    constructor(
        private jwtService: JwtService,
        private userService: UserService
    ) { }

    use(req: Request, res: Response, next: Function) {
        console.log('---> req.baseUrl ', req.originalUrl);
        console.log('---> req.body ', req.body);

        if (req.headers && req.headers.authorization && req.headers.authorization.split('Bearer ')[1]) {
            console.log('---> case 1' );
            const oldToken: string = req.headers.authorization.split('Bearer ')[1];
            const userId: string = this.jwtService.decodeJwt(oldToken).data;
            const newToken: string = this.jwtService.generateToken(userId, this.EXPIRES_IN);

            res.set('Access-Control-Expose-Headers', 'Authorization');
            res.set('Authorization', `Bearer ${newToken}`);
            return next();
        }

        if (req.originalUrl === `/category` && !req.headers.authorization) {
            console.log('---> case 2' );
            const userId: string = req.body.user;
            const newToken: string = this.jwtService.generateToken(userId, this.EXPIRES_IN);

            res.set('Access-Control-Expose-Headers', 'Authorization');
            res.set('Authorization', `Bearer ${newToken}`);
            return next();
        }

        if (req.originalUrl === `/user/token` && !req.headers.authorization) {
            console.log('---> case 3' );
            const userId: string = req.body.token;
            const newToken: string = this.jwtService.generateToken(userId, this.EXPIRES_IN);

            res.set('Access-Control-Expose-Headers', 'Authorization');
            res.set('Authorization', `Bearer ${newToken}`);
            return next();
        }
        console.log('---> next');
        next();
    }
}

