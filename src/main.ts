import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { fastifyApp } from './common/adapters/fastify.adapter';
import { ConfigService } from '@nestjs/config';
import { ConfigKeyPaths } from './config';
import { LoggerService } from './shared/logger/logger.service';
import { Logger } from '@nestjs/common';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyApp,
    {
      bufferLogs: true, // 启用日志缓冲，可以在应用停止时将所有日志一次性输出
      snapshot: true, // 启用快照功能，允许在处理请求时记录请求和响应的快照
      // forceCloseConnections: true, // 强制关闭连接（可选，默认为false）
    },
  );

  // 获取 ConfigService 实例以访问配置
  const configService = app.get(ConfigService<ConfigKeyPaths>);
  const { port, globalPrefix } = configService.get('app', { infer: true });
  app.useLogger(app.get(LoggerService));

  // 设置跨域
  app.enableCors({ origin: '*', credentials: true });
  // 设置全局前缀
  app.setGlobalPrefix(globalPrefix);

  // 启动应用并监听指定端口
  await app.listen(port, '0.0.0.0', async () => {
    const url = await app.getUrl();
    const { pid } = process;
    const logger = new Logger('NestApplication');
    logger.log(`[${pid}] 服务===> ${url}`);
  });

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
