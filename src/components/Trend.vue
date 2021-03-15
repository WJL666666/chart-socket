<template>
  <div class="container">
    <div class="title" :style="titleStyle">
      {{ '▎' + showTitle }}
      <div style="float: right">
        <span class="iconfont title-icon" :style="titleStyle" @click="showChoice = !showChoice">&#xe665;</span>
        <div class="select-title" v-show="showChoice" :style="marginStyle">
        <div class="select-item" v-for="item in selectTypes" :key="item.key" @click="handleSelect(item.key)">{{item.text}}</div></div>
      </div>
    </div>
    <div class="chart" ref="trend"></div>
  </div>
</template>

<script>
export default {
  name: 'Trend',
  data () {
    return {
      chartInstance: null,
      allData: null,
      showChoice: false,
      selectedType: 'map',
      titleFontSize: 0
    }
  },
  created () {
    this.$socket.registerCallback('trendData', this.getData)
  },
  computed: {
    selectTypes () {
      if (!this.allData) {
        return []
      } else {
        return this.allData.type.filter(item => {
          return item.key !== this.selectedType
        })
      }
    },
    showTitle () {
      if (!this.allData) {
        return ''
      } else {
        return this.allData[this.selectedType].title
      }
    },
    titleStyle () {
      return {
        fontSize: this.titleFontSize + 'px'
      }
    },
    marginStyle () {
      return {
        marginLeft: this.titleFontSize + 'px'
      }
    }
  },
  destroyed () {
    window.removeEventListener('resize', this.screenAdapter)
    this.$socket.unRegisterCallback('trendData')
  },
  mounted () {
    this.initChart()
    // this.getData()
    this.$socket.send({
      action: 'getData',
      socketType: 'trendData',
      chartName: 'trend',
      value: ''
    })
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  methods: {
    handleSelect (type) {
      console.log('type', type)
      this.selectedType = type
      this.updateChart()
      this.showChoice = false
    },
    initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.trend, 'theam')
      const initOption = {
        grid: {
          top: '25%',
          left: '10%',
          right: '10%',
          bottom: '10%'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          top: '15%',
          icon: 'circle'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false
        },
        yAxis: {
          type: 'value'
        }
      }
      this.chartInstance.setOption(initOption)
    },
    // 服务端发送给服务端的数据
    getData (ret) {
      // const { data: ret } = await this.$http.get('trend')
      this.allData = ret
      console.log('this.allData', this.allData)
      this.updateChart()
    },
    updateChart () {
      if (this.allData) {
        const colorArr1 = ['rgba(11, 168, 44, 0.5)', 'rgba(44, 110, 255, 0.5)', 'rgba(22, 242, 217, 0.5)', 'rgba(254, 33, 30, 0.5)', 'rgba(250, 105, 0, 0.5)']
        const colorArr2 = ['rgba(11, 168, 44, 0)', 'rgba(11, 168, 44, 0)', 'rgba(11, 168, 44, 0)', 'rgba(11, 168, 44, 0)', 'rgba(11, 168, 44, 0)']
        const timeArr = this.allData.common.month
        const valueArr = this.allData[this.selectedType].data
        const seriesArr = valueArr.map((item, index) => {
          return {
            name: item.name,
            type: 'line',
            data: item.data,
            stack: this.selectedType,
            areaStyle: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: colorArr1[index]
              }, { offset: 1, color: colorArr2[index] }])
            }
          }
        })
        const legendArr = valueArr.map(item => {
          return item.name
        })
        console.log(legendArr)
        console.log(seriesArr)
        const dataOption = {
          xAxis: {
            data: timeArr
          },
          legend: {
            data: legendArr
          },
          series: seriesArr
        }
        this.chartInstance.setOption(dataOption)
      }
    },
    screenAdapter () {
      this.titleFontSize = this.$refs.trend.offsetWidth / 100 * 3.6
      const adapterOption = {
        legend: {
          itemWidth: this.titleFontSize,
          itemHeight: this.titleFontSize,
          itemGap: this.titleFontSize,
          textStyle: {
            fontSize: this.titleFontSize / 2
          }
        }
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    }
  }
}
</script>

<style lang="less" scoped>
.title {
  position: absolute;
  left: 20px;
  top: 20px;
  z-index: 2;
  color: white;
  .title-icon {
    margin-left: 10px;
    cursor: pointer;
  }
  //.select-title {
  //  margin-left: ;
  //}
}
</style>
