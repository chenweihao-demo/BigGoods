<template>
  <div class="pro-sta">
    <div id="myChart" :style="{width: '60%', height: '500px'}"></div>
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

export default {
  data() {
    return {};
  },
  created() {},
  mounted() {
    this.getOrderList();
  },
  methods: {
    drawLine(n) {
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById("myChart"), 'macarons');
      // 绘制图表
      myChart.setOption({
       
        title: { text: "订单状态统计" },
        tooltip: {},
        xAxis: {
          data: ["待支付", "待发货", "待收货", "订单完成", "订单关闭"]
        },
        yAxis: {
          name: "数量" //轴的名字，默认位置在y轴上方显示
        },
        series: [
          {
            name: "订单",
            type: "bar",
            data: [...n]
          }
        ]
      });
    },

    //获取商品列表数据
    getOrderList() {
      //发起请求
      this.axios({
        method: "GET",
        url: "/orderStatus"
      })
        .then(result => {
          console.log(result);
          if (result.data.code == 1200) {
            let res = result.data.result[0];
            let arr = [
              res.status1,
              res.status2,
              res.status3,
              res.status4,
              res.status0
            ];
            this.drawLine(arr);
          }
        })
        .catch(err => {});
    }
  }
};
</script>

<style lang="less" scoped>
.pro-sta {
  padding: 50px;
}
</style>