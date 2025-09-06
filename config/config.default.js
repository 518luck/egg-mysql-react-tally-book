/* eslint valid-jsdoc: "off" */

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = (appInfo) => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {})

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1756021987280_3910'

  // add your middleware config here
  config.middleware = []

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
    uploadDir: 'app/public/upload',
  }
  config.cors = {
    origin: '*', // 允许所有跨域访问
    credentials: true, // 允许 Cookie 跨域跨域
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  }
  config.security = {
    csrf: {
      enable: false,
      // CSRF 防护
      ignoreJSON: true,
      // JSON 请求的 CSRF 检查
    },
    domainWhiteList: ['*'], // 白名单
    // 允许所有域名跨域访问
  }
  config.view = {
    mapping: {
      '.html': 'ejs', //左边写成.html后缀，会自动渲染.html文件
      // 上述的配置，指的是将 view 文件夹下的 .html 后缀的文件，识别为 .ejs。
    },
  }
  config.mysql = {
    // 单数据库信息配置
    client: {
      // host
      host: 'localhost',
      // 端口号
      port: '3306',
      // 用户名
      user: 'root',
      // 密码
      password: '123456', // 初始化密码，没设置的可以不写
      // 数据库名
      database: 'bill',
    },
    // 是否加载到 app 上，默认开启
    app: true,
    // 是否加载到 agent 上，默认关闭
    agent: false,
  }
  config.jwt = {
    secret: 'Nick',
  }
  config.multipart = {
    mode: 'file',
  }
  config.cluster = {
    listen: {
      port: 7001,
      hostname: '0.0.0.0',
    },
  }
  return {
    ...config,
    ...userConfig,
  }
}
