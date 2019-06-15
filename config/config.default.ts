import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export default (appInfo: EggAppInfo) => {

  const config = {} as PowerPartial<EggAppConfig>;
  config.keys = appInfo.name + '_1545281209678_6598';

  config.middleware = [];

  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
  };

  config.security = {
    csrf: {
      enable: false,
    },
  };

  config.sequelize = {
    dialect: 'mssql',
    pool: {
      max: 100,
      min: 20,
      idle: 10000,
    },
    host: '10.1.0.30',
    username: 'sa',
    password: '123',
    port: 1433,
    database: 'scm_main_数据分析',
    logging: true,
  };

  config.redis = {
    client: {
      port: 6379,
      host: '127.0.0.1',
      password: '',
      db: 1,
    },
  };

  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
  };

  return {
    ...config,
    ...bizConfig,
  };
};
