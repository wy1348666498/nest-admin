import { ConfigType, registerAs } from '@nestjs/config';
import { env, envNumber } from '../global/env';

export const appRegToken = 'app';

export const AppConfig = registerAs(appRegToken, () => ({
  /** 应用名称 **/
  name: env('APP_NAME'),
  /** 服务端口 **/
  port: envNumber('APP_PORT', 3000),
  /** 前缀 **/
  globalPrefix: env('GLOBAL_PREFIX', ''),
  /** 语言 **/
  locale: env('APP_LOCALE', 'zh-CN'),

  /** 日志配置 **/
  logger: {
    /** 日志级别 **/
    level: env('LOGGER_LEVEL'),
    /** 日志保留最大数 **/
    maxFiles: envNumber('LOGGER_MAX_FILES'),
    /** 存储路径 **/
    logPath: env('LOGGER_PATH', './logs'),
  },
}));

export type IAppConfig = ConfigType<typeof AppConfig>;
