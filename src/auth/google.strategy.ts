import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-google-oauth20";
import { JwtService } from '../services/jwt.service';
import * as dotenv from 'dotenv';

// Get environment variable from .env file
dotenv.config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {

    constructor(
        private jwtService: JwtService
    ) {
        super({
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: 'http://localhost:3000/auth/google/callback', //TODO setup remote endpoint
            passReqToCallback: true,
            scope: ['profile', 'email']
        })
    }

    async validate(request: any, accessToken: string, refreshToken: string, profile, done: Function) {
        try {
            console.log('profile ', profile);
            const jwt: string = 'placeholderJWT';
            const user = { jwt };

            done(null, user);
        }
        catch (err) {
            // console.log(err)
            done(err, false);
        }
    }
}