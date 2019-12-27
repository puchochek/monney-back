
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtService } from './/services/jwt.service';

@Injectable()
export class JwtMiddleware implements NestMiddleware {

    constructor(
        private jwtService: JwtService
    ) { }

    use(req: Request, res: Response, next: Function) {
        console.log('---> req.baseUrl ', req.originalUrl);
        if (req.headers && req.headers.authorization && req.headers.authorization.split('Bearer ')[1]) {
            const expiresIn: string = '7 days';
            const oldToken: string = req.headers.authorization.split('Bearer ')[1];
            const userId: string = this.jwtService.decodeJwt(oldToken).data;
            const newToken: string = this.jwtService.generateToken(userId, expiresIn);

            res.set('Access-Control-Expose-Headers', 'Authorization');
            res.set('Authorization', `Bearer ${newToken}`);
        }
        next();
    }
}

