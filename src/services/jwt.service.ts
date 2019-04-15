import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {

    generateToken(id: string, expiresIn: string): string {

        return jwt.sign({ id }, expiresIn);
    }

}