<template>
  <div class="products">
    <div class="header">
      <el-form ref="form" :model="searchInfo" label-width="80px" @submit.native.prevent>
        <el-form-item label="商品名称">
          <el-input v-model="searchInfo.name"></el-input>
        </el-form-item>
        <el-form-item label="商品类型">
          <el-select v-model="searchInfo.type" placeholder="请选择商品类型">
            <el-option
              v-for="(item, index) in proTypeList"
              :label="item.type"
              :value="item.typeId"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品状态">
          <el-select v-model="searchInfo.status" placeholder="请选择商品状态">
            <el-option label="请选择" value="default"></el-option>
            <el-option label="上架" value="1"></el-option>
            <el-option label="下架" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="添加日期">
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="searchInfo.date"
            style="width: 100%;"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item size="medium">
          <el-button type="primary" @click="search">搜索商品</el-button>
          <!-- <el-button @click="getProductList">全部商品</el-button> -->
        </el-form-item>
      </el-form>
      <div class="btn-box">
        <el-button type="warning" @click="goPro(2)">添加商品</el-button>
      </div>
    </div>
    <div class="content">
      <el-table :data="productList" stripe style="width: 100%">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="name" label="商品名称" width="180"></el-table-column>
        <el-table-column prop="type" label="商品类型" width="180"></el-table-column>
        <el-table-column prop="status" :formatter="isStatusFn" label="商品状态" width="180"></el-table-column>
        <el-table-column prop="created_at" label="添加时间" width="180"></el-table-column>
        <el-table-column prop="updated_at" label="更新时间" width="180"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="success" @click="goPro(1,scope.row.pid)">查看</el-button>
            <el-button size="mini" type="primary" @click="goPro(3,scope.row.pid)">编辑</el-button>
            <el-button
              size="mini"
              v-if="scope.row.status"
              type="info"
              @click="upDown(scope.row,0)"
            >下架</el-button>
            <el-button size="mini" v-else type="warning" @click="upDown(scope.row,1)">上架</el-button>
            <el-button size="mini" type="danger" @click="remove(scope.row,scope.$index)">删除</el-button>
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
    </div>
  </div>
</template>

<script>
//导入公共方法文件
import { tool } from "../assets/js/tool.js";
export default {
  data() {
    return {
      //搜索条件
      searchInfo: {
        name: "",
        type: "default",
        status: "default",
        date: ""
      },

      //商品类型
      proTypeList: [],

      // 当只有一页时隐藏分页
      isCurrent: true,

      //每一页显示10条数据
      pageCount: 10,

      //当前页面
      currentPage: 1,

      //总页面数
      total: 1,

      //商品列表数据
      productList: []
    };
  },
  created() {
    //获取商品类型
    this.getProType();

    //获取商品列表
    this.getProductList();

    this.getProductListRows();
  },
  methods: {
    //查看：1、添加：2、编辑：3
    goPro(id, pid) {
      let params = {
        id
      };
      if (pid) {
        params.pid = pid;
      }
      this.$router.push({ name: "Pro", params });
    },

    isStatusFn(row, column) {
      return row.status ? "上架" : "下架";
    },

    //获取商品类型
    getProType() {
      this.axios({
        method: "GET",
        url: "/proType"
      })
        .then(result => {
          //
          if (result.data.code == 1052) {
            result.data.result.unshift({
              typeId: "default",
              type: "请选择"
            });
            this.proTypeList = result.data.result;
          }
        })
        .catch(err => {});
    },

    //获取搜索条件
    getSearchCondition() {
      //获取搜索条件
      let searchCondition = this.searchInfo;

      //过滤条件
      //商品名称 、 日期不能为空
      //商品类型 、 商品不能为default
      let condition = {};

      if (searchCondition.name != "") {
        condition.name = searchCondition.name;
      }

      if (searchCondition.date != "") {
        condition.date = searchCondition.date;
      }

      if (searchCondition.type != "default") {
        condition.type = searchCondition.type;
      }

      if (searchCondition.status != "default") {
        condition.status = searchCondition.status;
      }

      return condition;
    },

    //搜索
    search() {
      this.currentPage = 1;
      this.total = 0;
      //获取商品列表
      this.getProductList();

      //获取商品列表记录数量
      this.getProductListRows();
    },

    //获取商品列表记录数量, 用于分页
    getProductListRows() {
      let condition = this.getSearchCondition();

      this.axios({
        method: "GET",
        url: "/productListRows",
        params: condition
      })
        .then(result => {
          this.total = Math.ceil(result.data.result / this.pageCount);
        })
        .catch(err => {});
    },

    //获取商品列表数据
    getProductList() {
      let condition = this.getSearchCondition();

      //偏移数据量
      condition.offset = (this.currentPage - 1) * this.pageCount;

      //查询数据量
      condition.limit = this.pageCount;

      //发起请求
      this.axios({
        method: "GET",
        url: "/productList",
        params: condition
      })
        .then(result => {
          if (result.data.code == 1080) {
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

            this.productList = result.data.result;
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
      this.getProductList();
    },

    //下一页
    nextPage() {
      if (this.currentPage == this.total) {
        return;
      }
      this.currentPage++;
      this.getProductList();
    },

    // 当前页码改变时
    currentChange(v) {
      this.currentPage = v;
      this.getProductList();
    },

    //上下架
    upDown(row, status) {
      this.axios({
        method: "POST",
        url: "/status",
        data: {
          status,
          pid: row.pid
        }
      })
        .then(result => {
          if (result.data.code == 1090 && result.data.result[0] == 1) {
            row.status = status;
          }
        })
        .catch(err => {});
    },

    //删除商品
    remove(row, index) {
      let pid = row.pid;

      this.axios({
        method: "POST",
        url: "/removeProduct",
        data: {
          pid
        }
      })
        .then(result => {
          if (result.data.code == 1074 && result.data.result == 1) {
            //如果存在下一页数据，则补全当前页数据
            //判断是否存在下一页
            if (this.currentPage < this.total) {
              // 重新获取商品列表数据
              this.getProductList();
              // 重新获取列表记录数量
              this.getProductListRows();
            } else {
              //如果是最后一页，存在两种可能
              //1--删除后，最后一页仍然存在数据，则只是删除当前数组数据，不换页码
              if (this.productList.length >= 2) {
                this.productList.splice(index, 1);
              } else {
                //2--删除后，最后一页不存在数据，判断是否存在上一页数据，如果存在上一页数据，则跳到上一页，否则隐藏分页控件

                //判断是否存在上一页数据
                if (this.currentPage > 1) {
                  this.currentPage--;
                  this.getProductList();
                  this.getProductListRows();
                } else {
                  this.productList.splice(index, 1);
                }
              }
            }
          }
        })
        .catch(err => {});
    }
  }
};
</script>

<style lang="less" scoped>
.products {
  .header {
    width: 100%;
    padding: 20px;
  }
}
.content {
  padding: 5px;
  margin: 0 1px 1px 1px;
  border: 1px solid #ebebeb;
}
.pagination {
  width: 100%;
  padding: 20px;
  text-align: center;
}
/deep/.el-form-item {
  display: inline-block;
}
/deep/.el-select {
  width: 100%;
}
/deep/.el-form-item__content {
  text-align: center;
}
</style>