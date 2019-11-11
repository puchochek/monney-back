import { Injectable, NestMiddleware, MiddlewareFunction } from '@nestjs/common';
// import { AppUser } from './db/entities/user.entity';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
import { UserService } from './user/user.service';

import { JwtService } from './services/jwt.service';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
    constructor(
        // @InjectRepository(AppUser) private readonly userRepository: Repository<AppUser>,
        private userService: UserService,
        private jwtService: JwtService
    ) { }

    resolve(...args: any[]): MiddlewareFunction {
        return (req, res, next) => {
            let oldToken;
            let userId;
            let newToken;
            const expiresIn = '7 days';

            console.log('---> req.baseUrl ', req.baseUrl);

            if (req.baseUrl === '/user/token') {
                userId = this.jwtService.verifyJwt(req.body.token).data;
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

            if (!req.headers.authorization) {
                console.log('---> no req.headers.authorization');
                return next();

            }

            oldToken = req.headers && req.headers.authorization && req.headers.authorization.split('Bearer ')[1];
            userId = this.jwtService.verifyJwt(oldToken).data;
            newToken = this.jwtService.generateToken(userId, expiresIn);

            //res.set('Content-Type', 'application/json');

            res.set('Access-Control-Expose-Headers', 'Authorization');
            res.set('Authorization', `Bearer ${newToken}`);
            //console.log('---> res ', res);
            next();
        };
    }
}