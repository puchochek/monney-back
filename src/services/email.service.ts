import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';
import { JwtService } from './jwt.service';
import * as dotenv from 'dotenv';

// Get environment variable from .env file
dotenv.config();

@Injectable()
export class EmailService {

  private server;

  constructor(private jwtService: JwtService) {
    this.server = nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  public sendRegistrationMail(emailAddres: string, id: string): Promise<any> {
    console.log('sendRegistrationMail');
    const expiresIn = '2 hours';
    const token = this.jwtService.generateToken(id, expiresIn);
    console.log('token ', token);
    //const link = `${ConfigService.get().CLIENT_URL}/activate/${token}`;
    const link = `<a href="${process.env.CLIENT_URL}/activate/${token}">${process.env.CLIENT_URL}/activate/${token}</a>`;
    console.log('link ', link);

    //const templatePath = __dirname + '/email-templates/registration.pug';

    return this.server.sendMail({
      text: '',
      from: '"Monney" <puchochek@gmail.com>',
      to: emailAddres,
      subject: 'Confirm your email in Monney',
      html: `Hello ${link}`,
    });
  }


}