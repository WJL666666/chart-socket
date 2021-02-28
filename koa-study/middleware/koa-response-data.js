// 读取文件内容
const path = require('path')
const fileUtils = require('../utils/file-utils')
module.exports = async (ctx, next) => {
    const url = ctx.request.url
    let filePath = url.replace('/api', '')
    filePath = '../data' + filePath + '.json'
    filePath = path.join(__dirname, filePath)
    try{
        const ret = await fileUtils.getFileData(filePath)
        ctx.response.body = ret
    }catch (err){
        const errMsg = {
            msg: '读取文件失败，该文件资源不存在',
            status: 404
        }
        ctx.body = JSON.stringify(errMsg)
    }
    console.log('111', url, filePath)
    await next()
}