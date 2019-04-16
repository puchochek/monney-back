import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {

  generateToken(id: string, expiresIn: string): string {
// TODO Amend sign method

    // jwt.sign(payload, this.JWT_SECRET, {
    //   algorithm: alg,
    //   expiresIn: expIn,
    // });

    return jwt.sign({ id }, expiresIn);
  }

  decodeJwt(token: string): string {
    console.log('token ', token);
    const JWT_SECRET = process.env.JWT_SECRET;
    let jwtDecoded: string;
    try {
      jwtDecoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      console.log(`Error verifying token: ${err.name}`);
      return null;
    }
    console.log('jwtDecoded ', jwtDecoded);
    return jwtDecoded;
  }
}