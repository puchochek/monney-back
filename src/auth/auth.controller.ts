import { Controller, Get, UseGuards, Res, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';


@Controller('auth')
export class AuthController {

    @Get('google')
    @UseGuards(AuthGuard('google'))
    googleLogin() {
        // initiates the Google OAuth2 login flow
    }

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    googleLoginCallback(@Req() req, @Res() res) {
        //console.log('req ', req);
        console.log('res ', res);
        // handles the Google OAuth2 callback
        const jwt: string = req.user.jwt;
        console.log('req.user ', req.user);
        console.log('jwt ', jwt);
        if (jwt)
            res.redirect('http://localhost:4200/home'); //HARDCODED
        else
            res.redirect('http://localhost:4200/home');
    }

}