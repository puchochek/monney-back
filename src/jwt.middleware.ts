
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtService } from './/services/jwt.service';

@Injectable()
export class JwtMiddleware implements NestMiddleware {

    constructor(
        private jwtService: JwtService
    ) { }

    use(req: Request, res: Response, next: Function) {
        let oldToken: string;
        let userId: string;
        let newToken: string;
        const expiresIn: string = '7 days';
        console.log('---> req ', req);
        oldToken = req.headers && req.headers.authorization && req.headers.authorization.split('Bearer ')[1];
        console.log('---> req.baseUrl ', req.baseUrl );
        console.log('---> oldToken ', oldToken);
        userId = this.jwtService.decodeJwt(oldToken).data;
        newToken = this.jwtService.generateToken(userId, expiresIn);
        console.log('---> newToken ', newToken);
        res.set('Access-Control-Expose-Headers', 'Authorization');
        res.set('Authorization', `Bearer ${newToken}`);

        next();
    }
}

