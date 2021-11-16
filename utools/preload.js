const Koa = require("koa");
const mount = require('koa-mount');
const serve = require("koa-static");

const app = new Koa();

app.use(mount('/', serve(__dirname + '/public')));

app.use(mount('/public', serve(__dirname + '/public')));

app.listen(7899, () => {
  console.log('服务已启动')
});