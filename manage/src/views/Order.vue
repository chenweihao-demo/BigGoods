<template>
  <div class="order">
    <!-- 搜索条件 -->
    <div class="header">
      <div class="order-title">订单列表</div>
      <div class="search fl">
        <el-input v-model="searchInfo.OrderNo" placeholder="订单编号"></el-input>
      </div>
      <div class="search fl">
        <el-input v-model="searchInfo.userName" placeholder="用户名"></el-input>
      </div>
      <div class="date">
        <el-date-picker
          v-model="searchInfo.orderDate"
          type="date"
          placeholder="选择提交日期"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </div>
      <div class="select">
        <el-select v-model="searchInfo.selectValue"  placeholder="请选择订单状态">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class>
        <el-button type="primary" @click="search">查询</el-button>
      </div>
    </div>
    <!-- 订单展示 -->
    <div class="order-list">
      <el-table :data="orderList" stripe style="width: 100%">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="oredr_id" label="订单编号" width="180"></el-table-column>
        <el-table-column prop="created_at" label="提交时间" width="180"></el-table-column>
        <el-table-column
          prop="payment_method"
          :formatter="isPaymentMethod"
          label="支付方式"
          width="100"
        ></el-table-column>
        <el-table-column prop="consignee_phone" label="手机号" width="120"></el-table-column>
        <el-table-column prop="nickname" label="用户名" width="100"></el-table-column>
        <el-table-column prop="price" label="订单金额" width="150"></el-table-column>
        <el-table-column prop="status" :formatter="isStatusFn" label="订单状态" width="100"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="success" @click="goPro(1,scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        :hide-on-single-page="isCurrent"
        background
        layout="prev, pager, next"
        :current-page="currentPage"
        :page-size="pageCount"
        :page-count="total"
        :pager-count="5"
        prev-text="　上一页　"
        next-text="　下一页　"
        @current-change="currentChange"
        @prev-click="prevPage"
        @next-click="nextPage"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { tool } from "../assets/js/tool.js";
export default {
  data() {
    return {
      OrderNo: "",
      userName: "",
      orderDate: "",
      //搜索条件
      searchInfo: {
        OrderNo: "",
        userName: "",
        orderDate: "",
        selectValue: ""
      },
      options: [
        {
          value: "1",
          label: "正常"
        },
        {
          value: "0",
          label: "失效"
        }
      ],

      // 订单列表
      orderList: [],
      // 当只有一页时隐藏分页
      isCurrent: true,

      //每一页显示10条数据
      pageCount: 10,

      //当前页面
      currentPage: 1,

      //总页面数
      total: 1
    };
  },
  created() {
    this.getOrderListRows();
    this.getOrderList();
  },
  methods: {
    goPro(id, v) {
      let params = {
        id
      };
      if (v) {
        params.data = v;
      }
      this.$router.push({ name: "CheckOrder", params });
    },
    // 搜索
    search() {
      this.currentPage = 1;
      this.total = 0;
      //获取商品列表
      this.getOrderList();

      //获取商品列表记录数量
      this.getOrderListRows();
    },
    // 支付方式：0未支付,1现金，2余额，3网银，4支付宝，5微信
    isPaymentMethod(row, column) {
      switch (row.payment_method) {
        case 0:
          return "未支付";
          break;
        case 1:
          return "现金";
          break;
        case 2:
          return "余额";
          break;
        case 3:
          return "网银";
          break;
        case 4:
          return "支付宝";
          break;
        case 5:
          return "微信";
          break;
        default:
          break;
      }
    },
    isStatusFn(row, column) {
      return row.status ? "正常" : "失效";
    },

    //获取搜索条件
    getSearchCondition() {
      //获取搜索条件
      let searchCondition = this.searchInfo;

      let condition = {};

      if (searchCondition.OrderNo != "") {
        condition.orderId = searchCondition.OrderNo;
      }

      if (searchCondition.userName != "") {
        condition.userName = searchCondition.userName;
      }

      if (searchCondition.orderDate != "") {
        condition.data = searchCondition.orderDate;
      }

      if (searchCondition.selectValue != "") {
        condition.status = searchCondition.selectValue;
      }

      return condition;
    },

    //获取商品列表记录数量, 用于分页
    getOrderListRows() {
      let condition = this.getSearchCondition();
      this.axios({
        method: "GET",
        url: "/orderListRows",
        params: condition
      })
        .then(result => {
          this.total = Math.ceil(result.data.result / this.pageCount);
        })
        .catch(err => {});
    },

    //获取商品列表数据
    getOrderList() {
      let condition = this.getSearchCondition();

      //偏移数据量
      condition.offset = (this.currentPage - 1) * this.pageCount;

      //查询数据量
      condition.limit = this.pageCount;

      //发起请求
      this.axios({
        method: "GET",
        url: "/ordersList",
        params: condition
      })
        .then(result => {
          console.log(result);
          if (result.data.code == 1100) {
            result.data.result.forEach(v => {
              v.created_at = tool.formatDate(
                new Date(v.created_at),
                "yyyy-MM-dd hh:mm:ss"
              );
              v.updated_at = tool.formatDate(
                new Date(v.updated_at),
                "yyyy-MM-dd hh:mm:ss"
              );
            });
            this.orderList = result.data.result;
          }
        })
        .catch(err => {});
    },

    //上一页
    prevPage() {
      if (this.currentPage == 1) {
        return;
      }
      this.currentPage--;
      this.getOrderList();
    },

    //下一页
    nextPage() {
      if (this.currentPage == this.total) {
        return;
      }
      this.currentPage++;
      this.getOrderList();
    },

    // 当前页码改变时
    currentChange(v) {
      this.currentPage = v;
      this.getOrderList();
    }
  }
};
</script>

<style lang="less" scoped>
.header {
  width: 100%;
  display: flex;
}
.order-list {
  padding: 5px;
  margin: 10px 1px 1px 1px;
  border: 1px solid #ebebeb;
}
.order-title {
  line-height: 38px;
}
.order {
  width: 100%;
  height: 100%;
  padding: 20px;
}
.search {
  padding: 0 20px;
}
.date {
  padding: 0 20px;
  /deep/.el-range-separator {
    width: 7%;
  }
}
.select {
  padding: 0 20px;
}
.pagination {
  width: 100%;
  padding: 20px;
  text-align: center;
}
</style>