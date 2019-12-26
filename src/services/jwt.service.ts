import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {
    private readonly JWT_SECRET = process.env.JWT_SECRET;

    constructor() {
    };

    generateToken(id: string, expiresInVal: string): string {
        const alg = 'HS256';

        return jwt.sign(
            { data: id },
            this.JWT_SECRET,
            { expiresIn: expiresInVal }
        );
    }

    // decodeJwt(token: string): any {
    // 	//console.log('---> decodeJwt ', token);
    // 	const JWT_SECRET = process.env.JWT_SECRET;
    // 	let jwtDecoded: {};
    // 	try {
    // 		jwtDecoded = jwt.verify(token, JWT_SECRET);
    // 	} catch (err) {
    // 		console.log(`Error verifying token: ${err.name}`);
    // 		return null;
    // 	}
    // //	console.log('----> jwtDecoded ', jwtDecoded);
    // 	return jwtDecoded;
    // }
}