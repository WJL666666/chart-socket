// 设置请求头
module.exports = async (ctx, next)=>{
    ctx.set('Content-Type', 'application/json; charset=utf-8')
    ctx.set('Access-Control-Allow-Origin', '*')
    ctx.set('Access-Control-Allow-Methods', 'OPTIONS, GET, PUT, POST, DELETE')
    // ctx.body = '{"success": true}'
    await next()
}