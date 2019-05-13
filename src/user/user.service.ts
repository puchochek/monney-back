import { Injectable } from '@nestjs/common';
import { AppUser } from '../db/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { EmailService } from '../services/email.service';

const saltRounds = 10;

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(AppUser) private readonly userRepository: Repository<AppUser>,
    private emailService: EmailService,
  ) { }

  hashPassword(password: string): string {
    const hashedPassword = bcrypt.hashSync(password, saltRounds);
    console.log('----> hashedPass ', hashedPassword);

    return hashedPassword ? hashedPassword : 'Error';
  }

  validateUserName(name: string): string {
    return name ? name : 'User';
  }

  validateEmail(email: string): string {
    const expression = /\S+@\S+/;
    // TODO What to do if email is invalid?
    return expression.test(String(email).toLowerCase()) ? email : 'Error';
  }

  async saveNewUser(user: any): Promise<AppUser[]> {
    const createdUser = await this.userRepository.save(user);
    console.log('----> createdUser ', createdUser);
    let emaitToSendAuth: string;
    let userId: string;

    if (createdUser) {
      emaitToSendAuth = createdUser.email;
      userId = createdUser.id;
    }

    const emailSendResult = await this.emailService.sendRegistrationMail(emaitToSendAuth, userId);

    console.log('----> emailSendResult', emailSendResult);

    return createdUser;

    

    // return await this.userRepository.save(user);

    // this.emailService.sendRegistrationMail('puchochek@gmail.com')
    //   .then(emailSendResult => {
    //     console.log('emailSendResult', emailSendResult);

    //     return this.userRepository.save(user);
    //   })
    //   .then(user => {
    //     return user;
    //   });
  }

  async getUsers(): Promise<AppUser[]> {
    return await this.userRepository.find();
  }

}
