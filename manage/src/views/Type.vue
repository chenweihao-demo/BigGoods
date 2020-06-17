<template>
  <div class="type">
    <!-- 搜索条件 -->
    <div class="clearfix">
      <div class="fl type-title">商品类型</div>
      <div class="search fl">
        <el-input v-model="typeTitle" placeholder="请输入类型名称" @keyup.enter.native="search"></el-input>
      </div>
      <div class="fl">
        <el-button type="primary" @click="search">搜索</el-button>
        <el-button type="primary" @click="getTypeData();getTypeDataRows()">全部商品类型</el-button>
      </div>
    </div>

    <div class="add">
      <el-button type="warning" @click="showModal(1)">添加商品类型</el-button>
    </div>
    <!-- 商品类型列表 -->
    <div class="type-list">
      <el-table :data="typeData" stripe style="width: 100%">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="type" label="类型名称" width="180"></el-table-column>
        <el-table-column prop="isEnable" :formatter="isEnableFn" label="状态" width="180"></el-table-column>
        <el-table-column prop="createdAt" label="添加时间" width="180"></el-table-column>
        <el-table-column prop="updatedAt" label="更新时间" width="180"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="showModal(2,scope.$index)">编辑</el-button>
            <el-button
              size="mini"
              v-if="scope.row.isEnable"
              type="danger"
              @click="toggleTypeStatus(scope.$index, scope.row,0)"
            >禁用</el-button>
            <el-button
              size="mini"
              v-else
              type="success"
              @click="toggleTypeStatus(scope.$index, scope.row,1)"
            >启用</el-button>
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
        :page-count="totalPage"
        :pager-count="5"
        prev-text="　上一页　"
        next-text="　下一页　"
        @current-change="currentChange"
        @prev-click="togglePage()"
        @next-click="togglePage(true)"
      ></el-pagination>
    </div>

    <!-- 添加商品类型 -->
    <el-dialog :title="title" :visible.sync="dialogFormVisible">
      <el-form>
        <el-form-item label="类型名称" :label-width="formLabelWidth">
          <el-input v-model="type" autocomplete="off" placeholder="输入类型名称"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveType">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
//导入公共方法文件
import { tool } from "../assets/js/tool.js";
export default {
  data() {
    return {
      //商品类型名称
      type: "",

      // 搜索类型
      typeTitle: "",

      //商品类型数据
      typeData: [],

      //添加或者编辑商品类型标题
      title: "添加商品类型",

      //编辑商品类型的id
      typeId: "",

      //搜索标记
      isSearch: false,

      // 当只有一页时隐藏分页
      isCurrent: true,
      //当前页码
      currentPage: 1,

      //每页显示10条数据
      pageCount: 10,

      //总页数
      totalPage: 1,

      // 模态框是否显示
      dialogFormVisible: false,

      // 模态框宽度
      formLabelWidth: "120px"
    };
  },
  created() {
    //获取商品类型数据
    this.getTypeData();
    //获取数据表的数据数量
    this.getTypeDataRows();
  },
  methods: {
    // 处理isEnable状态
    isEnableFn: function(row, column) {
      return row.isEnable ? "正常" : "禁用";
    },
    // 正常和启用
    toggleTypeStatus(index, row, status) {
      // return;
      this.axios({
        method: "POST",
        url: "/typeStatus",
        data: {
          status,
          typeId: row.typeId
        }
      })
        .then(result => {
          if (result.data.code == 1046) {
            this.typeData[index].isEnable = status;
          }

          this.$message({
            message: result.data.msg
          });
        })
        .catch(err => {});
    },
    //保存商品类型
    saveType() {
      if (
        (typeof this.type === "string" && this.type.trim() == "") ||
        this.type == null
      ) {
        this.$message({
          message: "请输入类型名称"
        });
        return;
      }
      if (!this.typeId) {
        //发起添加类型数据请求
        this.axios({
          method: "POST",
          url: "/addType",
          data: {
            type: this.type
          }
        })
          .then(result => {
            if (result.data.code == 1040) {
              //获取商品类型数据
              this.currentPage = 1;

              //获取商品类型
              this.getTypeData();

              //获取数据表的数据数量
              this.getTypeDataRows();

              this.$message({
                message: result.data.msg
              });
              this.dialogFormVisible = false;
              this.type = "";
            } else {
              this.$message({
                message: result.data.msg
              });

              this.type = "";
            }
          })
          .catch(err => {});
      } else {
        //验证商品类型是否更改
        if (this.type == this.typeData[this.index].type) {
          this.dialogFormVisible = false;
          this.type = "";

          return;
        }

        //编辑商品类型
        this.axios({
          method: "POST",
          url: "/type",
          data: {
            typeId: this.typeId,
            type: this.type
          }
        })
          .then(result => {
            //
            if (result.data.code == 1048) {
              this.dialogFormVisible = false;
            }

            this.$message({
              message: result.data.msg
            });

            this.typeData[this.index].type = this.type;
            this.typeData[this.index].updatedAt = tool.formatDate(
              new Date(),
              "yyyy-MM-dd hh:mm:ss"
            );
            this.type = "";
          })
          .catch(err => {});
      }
    },

    //获取商品类型数据
    getTypeData() {
      this.axios({
        method: "GET",
        url: "/getType",
        params: {
          //偏移数据量
          offset: (this.currentPage - 1) * this.pageCount,

          //查询数据量
          limit: this.pageCount
        }
      })
        .then(result => {
          result.data.result.forEach(v => {
            // v.isEnable = v.isEnable ? "正常" : "禁用";
            v.createdAt = tool.formatDate(
              new Date(v.createdAt),
              "yyyy-MM-dd hh:mm:ss"
            );

            v.updatedAt = tool.formatDate(
              new Date(v.updatedAt),
              "yyyy-MM-dd hh:mm:ss"
            );
          });

          this.typeData = result.data.result;
          this.isSearch = false;
          this.typeTitle = "";
        })
        .catch(err => {});
    },

    //搜索商品类型数据
    search() {
      if (
        (typeof this.typeTitle === "string" && this.typeTitle.trim() == "") ||
        this.typeTitle == null
      ) {
        this.$message({
          message: "请输入类型名称"
        });
        return;
      }

      this.currentPage = 1;
      //搜索商品类型
      this.searchType();

      //获取搜索商品数量
      this.seacrchRows();
    },
    //搜索商品类型
    searchType() {
      this.axios({
        method: "GET",
        url: "/searchType",
        params: {
          type: this.typeTitle,
          offset: (this.currentPage - 1) * this.pageCount,
          limit: this.pageCount
        }
      })
        .then(result => {
          if (result.data.code == 1044) {
            result.data.result.forEach(v => {
              v.createdAt = tool.formatDate(
                new Date(v.createdAt),
                "yyyy-MM-dd hh:mm:ss"
              );

              v.updatedAt = tool.formatDate(
                new Date(v.updatedAt),
                "yyyy-MM-dd hh:mm:ss"
              );
            });
            this.typeData = result.data.result;
          }
          if (!this.isSearch) {
            this.$message({
              message: result.data.msg
            });
          }
          this.isSearch = true;
        })
        .catch(err => {});
    },
    //搜索商品类型数据数量，用于搜索分页
    seacrchRows() {
      this.axios({
        method: "GET",
        url: "/searchRows",
        params: {
          type: this.typeTitle
        }
      })
        .then(result => {
          //分页
          this.totalPage = Math.ceil(result.data.result / this.pageCount);
        })
        .catch(err => {});
    },
    //显示模态框
    showModal(flag, index) {
      if (flag == 2) {
        this.typeId = this.typeData[index].typeId;
        this.type = this.typeData[index].type;
        this.title = "编辑商品类型";
        this.index = index;
      } else {
        this.typeId = "";
        this.type = "";
        this.title = "添加商品类型";
        this.index = -1;
      }

      this.dialogFormVisible = true;
    },
    //获取数据表的数据数量, 用于分页
    getTypeDataRows() {
      this.axios({
        method: "GET",
        url: "/typeRows"
      })
        .then(result => {
          //分页
          this.totalPage = Math.ceil(result.data.result / this.pageCount);
        })
        .catch(err => {});
    },
    // 当前页码改变时
    currentChange(v) {
      this.currentPage = v;
      if (this.isSearch) {
        this.searchType();
      } else {
        this.getTypeData();
      }
    },

    //点击上下页
    togglePage(isNext) {
      //下一页
      if (isNext) {
        if (this.currentPage < this.totalPage) {
          this.currentPage++;
          if (this.isSearch) {
            this.searchType();
          } else {
            this.getTypeData();
          }
        }
      } else {
        //上一页
        if (this.currentPage > 1) {
          this.currentPage--;
          if (this.isSearch) {
            this.searchType();
          } else {
            this.getTypeData();
          }
        }
      }
    }
  }
};
</script>

<style lang="less" scoped>
.add {
  margin-top: 10px;
}
.type-title {
  line-height: 38px;
}
.type {
  width: 100%;
  height: 100%;
  padding: 20px;
}
.search {
  width: 300px;
  margin: 0 20px;
}
.pagination {
  width: 100%;
  padding: 20px;
  text-align: center;
}
.type-list {
  padding: 5px;
  margin: 10px 1px 1px 1px;
  border: 1px solid #ebebeb;
}
</style>