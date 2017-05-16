
module.exports = {
  port: process.env.PORT || 3000,
  host: 'localhost',
  mongodb: {
    url: 'mongodb://127.0.0.1:27017/lagou'
  },
  email:{
    user: 'hd_mysky@qq.com',
    pass:''
  },
  //request log format
  logFormat : ':remote-addr - -' +
  ' ":method :url HTTP/:http-version"' +
  ' :status :content-length ":referrer"' +
  ' ":user-agent"' +
  ' ":response-time ms"',
  loggerName : 'default',
  routerConf: 'routes'
};