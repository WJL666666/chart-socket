const Koa = require('koa');
const app = new Koa();

// 第一层中间件
const respDuration = require('./middleware/koa-response-duration')
app.use(respDuration);
// 第二层中间件
const respHeader = require('./middleware/koa-response-header')
app.use(respHeader);
// 第三层中间件
const respData = require('./middleware/koa-response-data')
app.use(respData);
app.listen(8888,function(){
    console.log('server start ...');
});

// const WebSocket = require('ws')
// const wss = new WebSocket.Server({
//     port: 9998
// })
// // 对客户端的连接事件进行监听，client代表客户端的连接socket对象
// wss.on('connection', client => {
//     console.log('连接成功。。。')
//     client.on('message', msg => {
//         console.log('客户端发送数据给服务端了：' + msg)
//         client.send('hello socket')
//     })
// })
const websocketServer = require('./service/websocket')
websocketServer.listen()