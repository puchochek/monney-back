import { Module } from '@nestjs/common';
import { GoogleStrategy } from './google.strategy';

@Module({
    providers: [GoogleStrategy],
    imports: [],
    exports: [StrategiesModule]
})

export class StrategiesModule { }
