const path = require('path')
const fileUtils = require('../utils/file-utils')

const WebSocket = require('ws')
const wss = new WebSocket.Server({
  port: 9998
})

module.exports.listen = () => {
  // 对客户端的连接事件进行监听，client代表客户端的连接socket对象
  wss.on('connection', client => {
    console.log('连接成功。。。')
    client.on('message', async msg => {
      console.log('客户端发送数据给服务端了：' + msg)
      let payload = JSON.parse(msg)
      const action = payload.action
      if (action === 'getData') {
        let filePath = '../data/' + payload.chartName + '.json'
        filePath = path.join(__dirname, filePath)
        const ret = await fileUtils.getFileData(filePath)
        payload.data = ret
        client.send(JSON.stringify(payload))
      } else {
        wss.clients.forEach(client => {
          client.send(msg)
        })
      }
      // client.send('hello socket')
    })
  })
}
