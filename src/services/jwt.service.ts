import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {
    private readonly JWT_SECRET = process.env.JWT_SECRET;

    constructor() {
    };

    generateToken(id: string, expiresInVal: string): string {

        return jwt.sign(
            { data: id },
            this.JWT_SECRET,
            { expiresIn: expiresInVal }
        );
    }

    decodeJwt(token: string): any {
        let jwtDecoded: {};
        try {
            jwtDecoded = jwt.verify(token, this.JWT_SECRET);
        } catch (err) {
            console.log(`Error verifying token: ${err.name}`);
            return null;
        }

        return jwtDecoded;
    }
}