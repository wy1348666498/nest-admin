import { AppConfig, IAppConfig, appRegToken } from './app.config';

export * from './app.config';

export interface AllConfigType {
  [appRegToken]: IAppConfig;
}

export default { AppConfig };
