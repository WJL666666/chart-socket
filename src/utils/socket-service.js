/* eslint-disable */
export default class SocketService {
  static instance = null
  static get Instance () {
    if (!this.instance) {
      this.instance = new SocketService()
    }
    return this.instance
  }

  ws = null
  // 存储回调函数
  callBackMapping = {}

  connected = false

  sendRetryCount = 0

  // 定义连接服务器的方法
  connect () {
    console.log('111')
    if (!window.WebSocket) {
      return console.log('浏览器不支持WebSocket')
    }
    this.ws = new WebSocket('ws://localhost:9998')

    this.ws.onopen = () => {
      console.log('连接服务端成功')
      this.connected = true
    }
    this.ws.onclose = () => {
      console.log('连接服务端失败')
      this.connected = false
    }
    this.ws.onmessage = msg => {
      console.log('获取到数据')
      console.log(msg.data)
      const recv = JSON.parse(msg.data)
      const socketType = recv.socketType
      if (this.callBackMapping[socketType]) {
        const action = recv.action
        if (action === 'getData') {
          const data = JSON.parse(recv.data)
          this.callBackMapping[socketType].call(this, data)
        } else if (action === 'fullScreen') {

        } else if (action === 'theamChange') {

        }
      }
    }
  }

  registerCallback (socketType, callBack) {
    this.callBackMapping[socketType] = callBack
  }
  unRegisterCallback (socketType) {
    this.callBackMapping[socketType] = null
  }

  // 发送数据的方法
  send (data) {
    if (this.connected) {
      this.sendRetryCount = 0
      this.ws.send(JSON.stringify(data))
    } else {
      this.sendRetryCount++
      setTimeout(() => {
        this.send(data)
      }, this.sendRetryCount * 500)
    }
  }
}
