import { Injectable, NestMiddleware, MiddlewareFunction } from '@nestjs/common';

import { JwtService } from './services/jwt.service';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
    constructor(private jwtService: JwtService) { }

    resolve(...args: any[]): MiddlewareFunction {
        return (req, res, next) => {
            let oldToken;
            let userId;
            let newToken;
            const expiresIn = '7 days';
            console.log('---> req.baseUrl ', req.baseUrl);
            if (req.baseUrl === '/user/token') {
                console.log('---> req.body ', req.baseUrl);
                console.log('---> req.body ', req.body);
                userId = this.jwtService.verifyJwt(req.body.token).data;
                newToken = this.jwtService.generateToken(userId, expiresIn);
console.log('---> newToken ', newToken );
                res.set('Access-Control-Expose-Headers', 'Authorization');
                res.set('Authorization', `Bearer ${newToken}`);
                return next();
                // next();
            }

            console.log('---> req.headers.authorization ', !req.headers.authorization, ' ', req.headers.authorization);

            if (!req.headers.authorization) {
                console.log('---> no req.headers.authorization');
                return next();

            }

            oldToken = req.headers && req.headers.authorization && req.headers.authorization.split('Bearer ')[1];
            userId = this.jwtService.verifyJwt(oldToken).data;
            newToken = this.jwtService.generateToken(userId, expiresIn);

            res.set('Access-Control-Expose-Headers', 'Authorization');
            res.set('Authorization', `Bearer ${newToken}`);

            next();
        };
    }
}