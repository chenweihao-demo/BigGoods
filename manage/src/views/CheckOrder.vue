<template>
  <div class="order-detailed" >
    <el-page-header @back="backFn" content="订单详情"></el-page-header>
    <div class="header" v-if="orderData">
      <h4>订单编号：{{orderData.oredr_id}}</h4>
      <div class="steps">
        <el-steps :active="orderData.status">
          <el-step title="提交订单"></el-step>
          <el-step title="买家已付款"></el-step>
          <el-step title="卖家已发货"></el-step>
          <el-step title="买家已签收"></el-step>
        </el-steps>
      </div>
      <div class="state">
        订单状态：
        <el-tag type="success" v-if="orderData.status">正常</el-tag>
        <el-tag type="danger" v-else>失败</el-tag>
      </div>
    </div>
    <div class="content" v-if="orderData">
      <table>
        <tr>
          <th>
            <i class="fa fa-truck"></i>买家付款后才可以发货
          </th>
          <th>
            <i class="el-icon-s-custom"></i>买家：
          </th>
        </tr>
        <tr>
          <td>
            <i class="el-icon-location-outline"></i>
            <div>
              <p>
                <span>收货人：</span>
                {{orderData.consignee}}
              </p>
              <p>
                <span>手机：</span>
                {{orderData.consignee_phone}}
              </p>
              <p>
                <span>收货地址：</span>
                {{orderData.consignee_address}}
              </p>
            </div>
          </td>
          <td>
            <div>
              <i class="el-icon-chat-dot-square"></i>
              <span>买家备注：</span>
              <p>{{orderData.desc}}</p>
            </div>
          </td>
        </tr>
      </table>
    </div>
    <div class="footer" v-if="orderData">
      <table>
        <tr>
          <th>商品</th>
          <th>单价</th>
          <th>数量</th>
          <th>总价</th>
        </tr>
        <tr>
          <td>
            <div class="img-content-box">
              <img :src="orderData.img" alt="">
              <span>{{orderData.name}}</span>
            </div>
          </td>
          <td>￥{{orderData.price}}</td>
          <td>{{orderData.count}}</td>
          <td>￥{{(orderData.price*orderData.count)}}</td>
        </tr>
      </table>
      <div class="settlement">
        <div>
          商品总价：
          <span class="fr">￥{{(orderData.price*orderData.count)}}</span>
        </div>
        <div>
          应付金额：
          <span class="fr">￥{{(orderData.price*orderData.count)}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      orderData: {}
    };
  },
  created() {
    console.log();
    this.orderData = this.$route.params.data;
  },
  methods: {
    // 返回
    backFn() {
      this.$router.back();
    }
  }
};
</script>

<style lang="less" scoped>
.order-detailed {
  padding: 20px;
  .header {
    width: 100%;
    padding: 50px;
    .steps {
      width: 100%;
      padding: 20px 100px;
    }
    h4 {
      padding-bottom: 20px;
    }
  }
  .content {
    width: 100%;
    padding: 20px;
    table {
      width: 100%;
      tr {
        th {
          font-weight: normal;
          border: 1px solid #dddddd;
          padding: 20px 5px;
          &:first-child {
            width: 60%;
            border-left: transparent;
          }
          &:last-child {
            border-right: transparent;
          }
          i{
            margin-right: 10px;
          }
        }
        td {
          border: 1px solid #dddddd;
          padding: 20px 15px;
          &:first-child {
            border-left: transparent;
          }
          &:last-child {
            border-right: transparent;
          }
          div {
            p {
              span {
                display: inline-block;
                width: 100px;
                text-align: right;
                margin-top: 10px;
              }
            }
          }
        }
      }
    }
  }
  .footer {
    width: 100%;
    padding: 20px;
    table {
      width: 100%;
      tr {
        th {
          font-weight: normal;
          border: 1px solid #dddddd;
          padding: 20px 5px;
          text-align: center;
          &:first-child {
            text-align: left;
            width: 60%;
            border-left: transparent;
          }
          &:last-child {
            border-right: transparent;
          }
        }
        td {
          border: 1px solid #dddddd;
          padding: 20px 15px;
          text-align: center;
          &:first-child {
            text-align: left;
            border-left: transparent;
          }
          &:last-child {
            border-right: transparent;
          }
          .img-content-box{
            display: flex;
            // justify-content: center;
            align-items: center;
            
            img{
              width: 100px;
              height: auto;
            }
            span{
              margin-left: 20px;
            }
          }
        }
      }
    }
    .settlement {
      width: 40%;
      padding: 20px 0px;
      margin-left: auto;
      div {
        margin: 10px;
      }
    }
  }
}
</style>