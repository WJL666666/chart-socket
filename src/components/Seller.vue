/* eslint-disable */
<template>
  <div class="container">
    <div class="chart" ref="seller"></div>
  </div>
</template>

<script>
export default {
  name: 'Seller',
  data () {
    return {
      chartInstance: null,
      allData: null,
      curPage: 1,
      totalPage: 0,
      timerId: null
    }
  },
  destroyed () {
    clearInterval(this.timerId)
    window.removeEventListener('resize', this.screenAdapter)
  },
  mounted () {
    this.initChart()
    this.getData()
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  methods: {
    initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.seller, 'theam')
      const initOption = {
        title: {
          text: '▎商家销售统计',
          textStyle: {
            color: 'white'
          },
          top: 20,
          left: 20
        },
        grid: {
          top: '10%',
          left: '8%'
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category'
        },
        tooltip: {
          show: true,
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            z: 0,
            lineStyle: {
              color: '#2D3443'
            }
          }
        },
        series: [{
          type: 'bar',
          label: {
            show: true,
            position: 'right',
            textStyle: {
              color: 'white'
            }
          },
          itemStyle: {
            color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: '#5052EE' },
              { offset: 1, color: '#AB6EE5' }])
          }
        }]
      }
      this.chartInstance.setOption(initOption)

      this.chartInstance.on('mouseover', () => {
        clearInterval(this.timerId)
      })
      this.chartInstance.on('mouseout', () => {
        this.startInterval()
      })
    },
    async getData () {
      const { data: ret } = await this.$http.get('seller')
      this.allData = ret
      this.allData.sort((a, b) => {
        return a.value - b.value
      })
      this.totalPage = this.allData.length % 5 === 0 ? this.allData.length / 5 : this.allData.length / 5 + 1
      this.updateChart()
      this.startInterval()
    },
    updateChart () {
      const start = (this.curPage - 1) * 5
      const end = this.curPage * 5
      const showData = this.allData.slice(start, end)
      const sellerNames = showData.map(item => {
        return item.name
      })
      const sellerValues = showData.map(item => {
        return item.value
      })

      const dataOption = {
        yAxis: {
          data: sellerNames
        },
        series: [{
          data: sellerValues
        }]
      }
      this.chartInstance.setOption(dataOption)
    },
    startInterval () {
      if (this.timerId) {
        clearInterval(this.timerId)
      }
      this.timerId = setInterval(() => {
        this.curPage++
        console.log('this.curPage', this.curPage)
        if (this.curPage > this.totalPage) {
          this.curPage = 1
        }
        this.updateChart()
      }, 2000)
    },
    screenAdapter () {
      const titleFontSize = this.$refs.seller.offsetWidth / 100 * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize,
            color: 'white'
          }
        },
        tooltip: {
          axisPointer: {
            lineStyle: {
              width: titleFontSize
            }
          }
        },
        series: [{
          barWidth: titleFontSize,
          itemStyle: {
            borderRadius: [0, titleFontSize / 2, titleFontSize / 2, 0]
          }
        }]
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    }
  }
}
</script>

<style scoped>

</style>
