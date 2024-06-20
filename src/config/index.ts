import { AppConfig, IAppConfig, appRegToken } from './app.config';

export * from './app.config';

export interface AllConfigType {
  [appRegToken]: IAppConfig;
}

export type ConfigKeyPaths = RecordNamePaths<AllConfigType>;

export default { AppConfig };
