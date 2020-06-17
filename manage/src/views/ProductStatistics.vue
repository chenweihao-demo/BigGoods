<template>
  <div class="pro-sta">
    <div id="myChart" :style="{width: '60%', height: '500px'}" ></div>
  </div>
</template>

<script>
// 引入基本模板
let echarts = require("echarts/lib/echarts");
// 引入柱状图组件
require("echarts/lib/chart/bar");
// 引入提示框和title组件
require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");
require('../assets/js/wonderland')
export default {
  data() {
    return {
      dataName: [],
      dataCount: []
    };
  },
  created() {
    
  },
  mounted() {
    this.getProductList();
  },
  methods: {
    drawLine(n,c) {
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById("myChart"),'wonderland');
      // 绘制图表
      myChart.setOption({
        title: { text: "商品统计" },
        tooltip: {},
        xAxis: {
          data: [...n]
        },
        yAxis: {
          name: '库存数量',//轴的名字，默认位置在y轴上方显示
        },
        series: [
          {
            name: "库存",
            type: "bar",
            data: [...c]
          }
        ]
      });
    },
    getProductList() {
      //发起请求
      this.axios({
        method: "GET",
        url: "/productList"
      })
        .then(result => {
          let aryName = [];
          let aryCount = [];
          if (result.data.code == 1080) {
            for (let i = 0; i < result.data.result.length; i++) {
              this.dataName.push(result.data.result[i].name);
              this.dataCount.push(result.data.result[i].count);
              aryName.push(result.data.result[i].name);
              aryCount.push(result.data.result[i].count);
            }
            this.drawLine(aryName,aryCount);
          }
        })
        .catch(err => {});
    }
  }
};
</script>

<style lang="less" scoped>
.pro-sta{
  padding: 50px;
}
</style>