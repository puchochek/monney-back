import { Injectable, NestMiddleware, MiddlewareFunction } from '@nestjs/common';

import { JwtService } from './services/jwt.service';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
    constructor(private jwtService: JwtService) { }

    resolve(...args: any[]): MiddlewareFunction {
        return (req, res, next) => {
            if (!req.headers.authorization) {
                return next();
            }
            const oldToken = req.headers && req.headers.authorization && req.headers.authorization.split('Bearer ')[1];
            const userId = this.jwtService.verifyJwt(oldToken).data;
            const expiresIn = '7 days';
            const newToken = this.jwtService.generateToken(userId, expiresIn);

            res.set('Access-Control-Expose-Headers', 'Authorization');
            res.set('Authorization', `Bearer ${newToken}`);

            // res.header('Authorization', `Bearer ${newToken}`);
            // res.setHeader('Authorization', `Bearer ${newToken}`);
            // req.headers.authorization = `Bearer ${newToken}`;

            //res.headers.authorization = `Bearer ${newToken}`;

            // console.log('---> req.headers.authorization ', req.headers.authorization);
            console.log(123123123, '---> res.headers ', res.header());

            next();
        };
    }
}