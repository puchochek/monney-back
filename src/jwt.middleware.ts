import { Injectable, NestMiddleware, MiddlewareFunction } from '@nestjs/common';
import { JwtService } from './services/jwt.service';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
    constructor(
        private jwtService: JwtService
    ) { }

    resolve(...args: any[]): MiddlewareFunction {
        return (req, res, next) => {
            let oldToken: string;
            let userId: string;
            let newToken: string;
            const expiresIn = '7 days';

            console.log('---> req.baseUrl ', req.baseUrl);

            if (req.baseUrl === '/user/activate') {
                userId = this.jwtService.decodeJwt(req.body.token).data;
                newToken = this.jwtService.generateToken(userId, expiresIn);

                res.set('Access-Control-Expose-Headers', 'Authorization');
                res.set('Authorization', `Bearer ${newToken}`);
                return next();
            }

            if (req.baseUrl.includes(`/user/user-token/`)) {
                const urlId = req.baseUrl.substring(17);
                newToken = this.jwtService.generateToken(urlId, expiresIn);

                res.set('Access-Control-Expose-Headers', 'Authorization');
                res.set('Authorization', `Bearer ${newToken}`);
                return next();
            }

            if (req.baseUrl.includes(`/user/avatar`)) {
                const urlId = req.baseUrl.substring(13);
                newToken = this.jwtService.generateToken(urlId, expiresIn);

                res.set('Access-Control-Expose-Headers', 'Authorization');
                res.set('Authorization', `Bearer ${newToken}`);
                return next();
            }

            if (!req.headers.authorization) {
                console.log('---> no req.headers.authorization');
                return next();

            }

            oldToken = req.headers && req.headers.authorization && req.headers.authorization.split('Bearer ')[1];
            userId = this.jwtService.decodeJwt(oldToken).data;
            newToken = this.jwtService.generateToken(userId, expiresIn);

            res.set('Access-Control-Expose-Headers', 'Authorization');
            res.set('Authorization', `Bearer ${newToken}`);
            next();
        };
    }
}