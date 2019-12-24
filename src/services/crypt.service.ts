import { Injectable } from '@nestjs/common';
//import * as jwt from 'jsonwebtoken';

@Injectable()
export class CryptService {

    getId(): string {
        const uuidv4 = require('uuid/v4');
        return uuidv4();
    }
}