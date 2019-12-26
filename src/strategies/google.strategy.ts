import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-google-oauth20";
import * as dotenv from 'dotenv';

// Get environment variable from .env file
dotenv.config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {

    constructor() {
        super({
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: process.env.CLIENT_CALLBACK_URL,
            passReqToCallback: true,
            scope: ['profile', 'email']
        })
    }

    async validate(request: any, accessToken: string, refreshToken: string, profile, done: Function) {
        try {
            console.log('profile S ', profile);
            const user = { profile };
            done(null, user);
        }
        catch (err) {
            // console.log(err)
            done(err, false);
        }
    }
}