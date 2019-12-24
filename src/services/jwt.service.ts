import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
enum Provider {
    GOOGLE = 'google'
}

@Injectable()
export class JwtService {
    private readonly JWT_SECRET = process.env.JWT_SECRET;

    // constructor(/*private readonly usersService: UsersService*/) {
    // };

    // async validateOAuthLogin(thirdPartyId: string, provider: Provider): Promise<string> {
    //     try {
    //         // You can add some registration logic here,
    //         // to register the user using their thirdPartyId (in this case their googleId)
    //         // let user: IUser = await this.usersService.findOneByThirdPartyId(thirdPartyId, provider);

    //         // if (!user)
    //         // user = await this.usersService.registerOAuthUser(thirdPartyId, provider);

    //         const payload = {
    //             thirdPartyId,
    //             provider
    //         }

    //         const jwt: string = sign(payload, this.JWT_SECRET, { expiresIn: 3600 });
    //         return jwt;
    //     }
    //     catch (err) {
    //         throw new InternalServerErrorException('validateOAuthLogin', err.message);
    //     }
    // }



    generateToken(id: string, expiresInVal: string): string {
        const alg = 'HS256';
        //const JWT_SECRET = process.env.JWT_SECRET;

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