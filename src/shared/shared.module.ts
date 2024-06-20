import { Global, Module } from '@nestjs/common';
import { LoggerModule } from './logger/logger.module';

@Global()
@Module({
  imports: [
    // 日志模块
    LoggerModule.forRoot(),
  ],
  exports: [],
})
export class SharedModule {}
