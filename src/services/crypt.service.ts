import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
//import * as jwt from 'jsonwebtoken';

@Injectable()
export class CryptService {
    private saltRounds = 10;

    getId(): string {
        const uuidv4 = require('uuid/v4');
        return uuidv4();
    }

    hashPassword(password: string): string {
        const hashedPassword = bcrypt.hashSync(password, this.saltRounds);

        return hashedPassword ? hashedPassword : 'Error';
    }
    //FFU
    comparePasswords(passwordToCompare: string, selectedUserPassword: string): boolean {
        return bcrypt.compareSync(passwordToCompare, selectedUserPassword);
    }
}