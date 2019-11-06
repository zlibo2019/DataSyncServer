import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export default (appInfo: EggAppInfo) => {

  // const { ctx } = this;
  const config = {} as PowerPartial<EggAppConfig>;
  config.keys = appInfo.name + '_1545281209678_6598';

  config.middleware = [];

  config.security = {
    csrf: {
      enable: false,
    },
  };

  config.sequelize = {
    dialect: 'mssql',     // 数据库类型
    // database: 'scm_main_安丰钢厂',   // 数据库名称
    database: 'scm_main_sjfx',   // 数据库名称
    timezone: '+08:00',
    pool: {
      max: 5000,
      min: 0,
      idle: 100000,
    },
    // host: '10.16.0.10',     // 服务器
    host: '10.21.0.30',     // 服务器
    port: 1433,           // 端口 
    username: 'sa',        // 用户名
    password: '123456',       // 密码
    dialectOptions: {
      instanceName: 'sqlexpress',    // 实例名
      connectTimeout: 600000,      // 连接超时时间
      requestTimeout: 999999,     // 请求超时时间
    },
    logging: false,                  // 是否打印sql日志
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

  config.httpclient = {
    // @ts-ignore
    request: {
      timeout: 7200000,
    },
    httpAgent: {
      keepAlive: true,
      freeSocketTimeout: 4000,
      maxSockets: Number.MAX_SAFE_INTEGER,
      maxFreeSockets: 256,
    },
    httpsAgent: {
      keepAlive: true,
      freeSocketTimeout: 4000,
      maxSockets: Number.MAX_SAFE_INTEGER,
      maxFreeSockets: 256,
    },
  };


  config.logger = {
    level: 'INFO',
    consoleLevel: 'INFO',//'NONE',
  };


  config.program = {
    current_ip: '10.18.0.2',
    current_port: 7001,
    connectTimeout: 600000,
    max_running_task: 20,
    task_timeout: 600000,      //1200000,
    insertTableList: [
      {
        name: 'DtUser',
        condition: {
          where: {
            user_serial: {
              $in: ['@user'],
            }
          }
        },
      },
      {
        name: 'KtJl',
        condition: {
          where: {
            user_serial: {
              $in: ['@user'],
            },
            sj: {
              $between: ['@begin_date', '@end_date'],
            }
          }
        },
      },
      {
        name: 'WtReg',
      },
      {
        name: 'LrJiaba',
        condition: {
          where: {
            user_serial: {
              $in: ['@user'],
            },
            jbrq: {
              $between: ['@begin_date', '@end_date'],
            },
          }
        },
      },
      {
        name: 'LrWaich',
        condition: {
          where: {
            user_serial: {
              $in: ['@user'],
            },
            jbrq: {
              $between: ['@begin_date', '@end_date'],
            },
          }
        },
      },
      {
        name: 'ZtDay',
        condition: {
          where: {
            user_serial: {
              $in: ['@user'],
            },
            dkrq: {
              $between: ['@begin_date', '@end_date'],
            },
            shenhe: 1,
          }
        },
      },
      {
        name: 'KtRule',
      },
      {
        name: 'ZtBanci',
      },
      {
        name: 'ZtShid',
        isHavePrimaryKey: false,
      },
      {
        name: 'KtJjr',
      },
      {
        name: 'KtQingj',
      },
      {
        name: 'KtPaiba',
        condition: {
          where: {
            user_serial: {
              $in: ['@user'],
            },
            rq: {
              $between: ['@begin_month', '@end_month'],
            },
          }
        },
      },
      {
        name: 'KtTiao',
      },
      {
        name: 'ZtYich',
        condition: {
          where: {
            user_serial: 0,
          },
        },
      },
    ],
    reverseInsertTableList: [
      {
        name: 'KtWaich',
        condition: {
          where: {
            user_serial: {
              $in: ['@user'],
            },
            jbrq: {
              $between: ['@begin_date', '@end_date'],
            },
          },
        },
      },
      {
        name: 'KtJiaba',
        condition: {
          where: {
            user_serial: {
              $in: ['@user'],
            },
            jbrq: {
              $between: ['@begin_date', '@end_date'],
            },
          },
        },
      },
      {
        name: 'LrWaich',
        condition: {
          where: {
            user_serial: {
              $in: ['@user'],
            },
            jbrq: {
              $between: ['@begin_date', '@end_date'],
            },
            lx: 1,
          },
        },
      },
      {
        name: 'LrJiaba',
        condition: {
          where: {
            user_serial: {
              $in: ['@user'],
            },
            jbrq: {
              $between: ['@begin_date', '@end_date'],
            },
            lx: 1,
          },
        },
      },
      {
        name: 'ZtYich',
        condition: {
          where: {
            user_serial: {
              $in: ['@user'],
            },
            sj: {
              $between: ['@begin_date', '@end_date'],
            },
          },
        },
      },
      {
        name: 'ZtDay',
        condition: {
          where: {
            user_serial: {
              $in: ['@user'],
            },
            dkrq: {
              $between: ['@begin_date', '@end_date'],
            },
          },
        },
      },
    ],
    reverseUpdateTableList: [
      {
        name: 'KtJl',
      },
    ],
  }

  return {
    ...config,
  };
};
