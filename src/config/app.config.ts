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
}));

export type IAppConfig = ConfigType<typeof AppConfig>;
