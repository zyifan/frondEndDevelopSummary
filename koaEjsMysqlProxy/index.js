var Koa=require('koa');
var path=require('path')
var bodyParser = require('koa-bodyparser');
var ejs=require('ejs');
var session = require('koa-session-minimal');
var MysqlStore = require('koa-mysql-session');
var config = require('./config/default.js');
var router=require('koa-router')
var views = require('koa-views')
var koaStatic = require('koa-static')
var app=new Koa()

require('./proxy');


// session存储配置
const sessionMysqlConfig= {
  user: config.database.username,
  password: config.database.password,
  database: config.database.database,
  host: config.database.host,
}

// 配置session中间件
app.use(session({
  key: 'USER_SID',
  store: new MysqlStore(sessionMysqlConfig)
}))


// 配置静态资源加载中间件
app.use(koaStatic(
  path.join(__dirname , './public')
))

// 配置服务端模板渲染引擎中间件
app.use(views(path.join(__dirname, './views'), {
  extension: 'ejs'
}))

// 使用表单解析中间件
app.use(bodyParser())

// 使用新建的路由文件
app.use(require('./routers/signin.js').routes())
app.use(require('./routers/signup.js').routes())
app.use(require('./routers/posts.js').routes())
app.use(require('./routers/signout.js').routes())

// 监听在7000端口
app.listen(config.port)

console.log(`listening on port ${config.port}`)

/**
 * 使用koa-session-minimal``koa-mysql-session来进行数据库的操作 
   使用koa-static配置静态资源，目录设置为public 
   使用ejs模板引擎 
   使用koa-bodyparser来解析提交的表单信息 
   使用koa-router做路由
 */