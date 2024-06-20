import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import config from './config';
import { minutes, ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';

@Module({
  imports: [
    // 配置模块
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      // 指定多个 env 文件时，第一个优先级最高
      envFilePath: ['.env.local', `.env.${process.env.NODE_ENV}`, '.env'],
      load: [...Object.values(config)],
    }),
    // 避免暴力请求，限制同一个接口 15分钟内最多只能访问1000次
    ThrottlerModule.forRootAsync({
      useFactory: () => ({
        errorMessage: '当前操作过于频繁，请稍后再试！',
        throttlers: [{ ttl: minutes(15), limit: 1000 }],
      }),
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useFactory: () => new TimeoutInterceptor(15 * 1000),
    },

    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
