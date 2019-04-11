import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';

// Get environment variable from .env file
dotenv.config();

@Injectable()
export class EmailService {

  private server;

  constructor() {
    this.server = nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  public sendRegistrationMail(emailAddres: string): Promise<any> {
    //const token = this.jwtService.generateToken({ id }, '2 hours');
    //const link = `${ConfigService.get().CLIENT_URL}/activate/${token}`;

    //const templatePath = __dirname + '/email-templates/registration.pug';

    return this.server.sendMail({
      text: '',
      from: '"Monney" <puchochek@gmail.com>',
      to: emailAddres,
      subject: 'Confirm your email in Monney',
      html: 'Hello',
    });
  }


}