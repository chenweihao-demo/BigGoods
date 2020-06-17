<template>
  <div class="pro">
    <div class="content">
      <el-form ref="form" :model="productInfo" label-width="85px" label-position="left">
        <el-form-item label="商品名称">
          <el-input v-model="productInfo.name" maxlength="30" :disabled="id == 1"></el-input>
        </el-form-item>
        <el-form-item label="商品类型">
          <el-select v-model="productInfo.type" placeholder="请选择商品类型" :disabled="id == 1">
            <el-option
              v-for="(item, index) in proTypeList"
              :label="item.type"
              :value="item.typeId"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品价格">
          <el-input v-model="productInfo.price" :disabled="id == 1"></el-input>
        </el-form-item>
        <el-form-item label="库存">
          <el-input v-model="productInfo.count" :disabled="id == 1"></el-input>
        </el-form-item>
        <el-form-item label="商品图片">
          <div class="upload">
            <Upload @file-upload="fileUpload" :size="size" :id="id" :disabled="id == 1">
              <img
                class="auto-img"
                v-if="temporaryProductInfo.img == productInfo.img"
                :src="staticUrl + '/' + temporaryProductInfo.img"
                alt
              />
            </Upload>
          </div>
        </el-form-item>
        <el-form-item label="商品详情图">
          <div class="upload">
            <Upload @file-upload="detailFileUpload" :size="size" :id="id" :disabled="id == 1">
              <img
                class="auto-img"
                v-if="temporaryProductInfo.imgDetail == productInfo.imgDetail"
                :src="staticUrl + '/' + temporaryProductInfo.imgDetail"
                alt
              />
            </Upload>
          </div>
        </el-form-item>
        <el-form-item label="商品状态">
          <el-radio-group v-model="productInfo.status" :disabled="id == 1">
            <el-radio label="1">上架</el-radio>
            <el-radio label="0">下架</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="商品描述">
          <el-input
            type="textarea"
            v-model="productInfo.desc"
            maxlength="200"
            show-word-limit
            :autosize="{ minRows: 5, maxRows: 11}"
            :disabled="id == 1"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="postProduct" v-if="id == 2 || id == 3">发布商品</el-button>
          <el-button @click="backFn">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import Upload from "../components/Upload.vue";
export default {
  name: "Pro",
  data() {
    return {
      //上传图片大小的最大值
      size: 0.5,
      //商品类型列表
      proTypeList: [],

      id: "",

      pid: "",

      //保存上传商品信息
      productInfo: {
        //商品名称
        name: "",
        //商品类型
        type: "default",
        //商品价格
        price: "",
        //库存
        count: "",
        //商品图片
        img: "",
        //商品图片类型 jpg, png, ...
        imgType: "",
        //商品详情图片
        imgDetail: "",
        //商品详情图片类型 jpg, png, ...
        imgDetailType: "",
        //1：上架、0：下架
        status: "1",
        //描述
        desc: ""
      },

      //临时数据, 用于判断用户是否修改商品数据
      temporaryProductInfo: {}
    };
  },
  created() {
    //截取路由参数
    let params = this.$route.params;
    console.log("params ==> ", params);

    this.id = params.id;
    this.pid = params.pid;

    //获取商品类型
    this.getProType();
    if (params.id == 1 || params.id == 3) {
      this.getProductByPid(params.pid);
    }
  },
  methods: {
    // 返回
    backFn() {
      this.$router.back();
    },
    //获取上传商品图片信息
    fileUpload(e) {
      this.productInfo.img = e.base64.replace(
        /data:image\/[A-Za-z]+;base64,/,
        ""
      );

      this.productInfo.imgType = e.type;
    },

    //获取上传商品详情图片信息
    detailFileUpload(e) {
      this.productInfo.imgDetail = e.base64.replace(
        /data:image\/[A-Za-z]+;base64,/,
        ""
      );
      this.productInfo.imgDetailType = e.type;
    },

    //获取商品类型
    getProType() {
      this.axios({
        method: "GET",
        url: "/proType"
      })
        .then(result => {
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

    //发布商品
    postProduct() {
      //表单验证
      // 验证是否包含script标签
      let nameReg = /<\/?script>/;
      //^[1-9]\d+$ ==> 整数
      //^0\.\d{1,2}$ ==> 0.xx的小数
      //^[1-9]\d*\.\d{1,2}$ ==> 121.xx小数
      // 验证价钱
      let priceReg = /^(([1-9]\d*)|0)(\.\d{1,2})?$/;
      // 验证库存
      let countReg = /^[1-9]\d+$/;

      if (this.productInfo.name == "" || nameReg.test(this.productInfo.name)) {
        this.$message({
          message: "商品名称不能为空且不能含有<script>字符",
          duration: 3000
        });
      } else if (this.productInfo.type == "default") {
        this.$message({
          message: "请选择商品类型",
          duration: 3000
        });
      } else if (!priceReg.test(this.productInfo.price)) {
        this.$message({
          message: "价格只能填写数字且最多含两位小数",
          duration: 3000
        });
      } else if (!countReg.test(this.productInfo.count)) {
        this.$message({
          message: "库存只能填写数字且为整数",
          duration: 3000
        });
      } else if (this.productInfo.img == "") {
        this.$message({
          message: "请上传商品图片",
          duration: 3000
        });
      } else if (this.productInfo.imgDetail == "") {
        this.$message({
          message: "请上传商品详情图片",
          duration: 3000
        });
      } else if (
        this.productInfo.desc == "" ||
        nameReg.test(this.productInfo.desc)
      ) {
        this.$message({
          message: "商品描述不能为空且不能含有<script>字符",
          duration: 3000
        });
      } else {
        //发起请求
        if (this.id == 2) {
          //添加商品
          this.addProduct(this.productInfo);
        } else {
          //编辑商品

          //获取编辑的数据
          let data = {};
          for (let key in this.temporaryProductInfo) {
            //对比数据
            if (this.temporaryProductInfo[key] != this.productInfo[key]) {
              if (key == "img" || key == "imgDetail") {
                data[key + "Type"] = this.productInfo[key + "Type"];
              }
              data[key] = this.productInfo[key];
            }
          }

          if (JSON.stringify(data) == "{}") {
            console.log("没有修改数据");
            return;
          }

          data.pid = this.pid;

          console.log("data ==> ", data);

          this.editProduct(data);
        }
      }
    },
    //添加商品
    addProduct(data) {
      this.axios({
        method: "POST",
        url: "/postProduct",
        data
      })
        .then(result => {
          // console.log('result ==> ', result);
          if (result.data.code == 1070) {
            this.$message({
              message: result.data.msg,
              duration: 3000
            });
            this.$router.push({ name: 'Products' });
          }
        })
        .catch(err => {
          console.log("err ==> ", err);
        });
    },

    //编辑商品
    editProduct(data) {
      this.axios({
        method: "POST",
        url: "/editProduct",
        data
      })
        .then(result => {
          console.log("result ==> ", result);

          if (result.data.code == 1078) {
            this.$message({
              message: result.data.msg,
              duration: 3000
            });
            this.$router.push({ name: 'Products' });
          }
        })
        .catch(err => {
          console.log("err ==> ", err);
        });
    },

    //根据商品pid查看商品数据
    getProductByPid(pid) {
      this.axios({
        method: "GET",
        url: "/productByPid",
        params: {
          pid
        }
      })
        .then(result => {
          result.data.result.forEach(v => {
            v.status = v.status ? "1" : "0";
          });
          this.productInfo = result.data.result[0];

          //复制一份临时数据, 用于判断用户是否修改商品数据
          this.temporaryProductInfo = Object.assign({}, this.productInfo);
        })
        .catch(err => {
          console.log("err ==> ", err);
        });
    }
  },
  //局部注册组件
  components: {
    Upload
  }
};
</script>

<style lang="less" scoped>
.pro {
  padding: 20px;
  .content {
    width: 50%;
  }
}
/deep/.el-select {
  width: 100%;
}
</style>