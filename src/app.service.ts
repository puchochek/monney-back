import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {

  constructor() {}

  getId(): string {
    const uuidv4 = require('uuid/v4');
    return uuidv4();
  }

  parseDate(dateToparse: string): Date {
    const parsedDate =  dateToparse.split('.');
    const year = parsedDate[2].substring(0, 4);
    const month = parsedDate[1].length === 1 ?
      '0' + parsedDate[1]
      : parsedDate[1];
    const day = parsedDate[0].length === 1 ?
    '0' + parsedDate[0]
    : parsedDate[0];

    const date = new Date(year + '-' + month + '-' + day);
    return date;
  }
}
