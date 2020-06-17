<template>
  <div class="user">
    <div class="header">
      <el-page-header @back="backFn" content="用户信息"></el-page-header>
    </div>
    <div class="content">
      <el-form ref="form" label-position="right" :model="temporaryUserInfo" label-width="85px">
        <el-form-item label="头像">
          <div class="upload">
            <Upload @file-upload="fileUpload" :size="size" :id="id">
              <img
                class="auto-img"
                v-if="temporaryUserInfo.userImg == userInfo.userImg"
                :src="staticUrl + '/' + userInfo.userImg"
                alt
              />
            </Upload>
          </div>
        </el-form-item>
        <el-form-item label="id">
          <h3>{{temporaryUserInfo.userId}}</h3>
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="temporaryUserInfo.nickname"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <h3>{{temporaryUserInfo.email}}</h3>
        </el-form-item>
        <el-form-item label="状态">
          <el-tag type="success" v-if="!temporaryUserInfo.isDestroy">正常</el-tag>
          <el-tag type="danger" v-else>注销</el-tag>
        </el-form-item>
        <el-form-item label="注册时间">
          <h3>{{temporaryUserInfo.createdAt}}</h3>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="preservation">修改保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import Upload from "../components/Upload.vue";
import { mapActions } from "vuex";
export default {
  data() {
    return {
      size: 0.5,
      id: "3",
      userInfo: {},
      temporaryUserInfo: {}
    };
  },
  created() {
    console.log(this.$route);
    this.userInfo = this.$route.params.user;
    this.temporaryUserInfo = Object.assign({}, this.userInfo);
  },
  methods: {
    ...mapActions(["getUserInfo"]),
    // 获取用户上传图片
    fileUpload(e) {
      this.temporaryUserInfo.userImg = e.base64.replace(
        /data:image\/[A-Za-z]+;base64,/,
        ""
      );
      this.temporaryUserInfo.userImgType = e.type;
    },
    // 修改保存
    preservation() {
      let nameReg = /<\/?script>/;
      if (
        this.userInfo.nickname == "" ||
        nameReg.test(this.userInfo.nickname)
      ) {
        this.$message({
          message: "昵称不能为空且不能含有<script>字符",
          duration: 3000
        });
      } else {
        //获取编辑的数据
        let data = {};
        for (let key in this.temporaryUserInfo) {
          //对比数据
          if (this.temporaryUserInfo[key] != this.userInfo[key]) {
            if (key == "userImg") {
              data[key + "Type"] = this.temporaryUserInfo[key + "Type"];
            }
            data[key] = this.temporaryUserInfo[key];
          }
        }

        if (JSON.stringify(data) == "{}") {
          return;
        }
        data.userId = this.userInfo.userId;
        this.editProduct(data);
      }
    },
    //编辑商品
    editProduct(data) {
      this.axios({
        method: "POST",
        url: "/editUserInfo",
        data
      })
        .then(result => {
          this.getUserInfoData();
          if (result.data.code == 1078) {
            this.$message({
              message: result.data.msg,
              duration: 3000
            });
          }
        })
        .catch(err => {});
    },
    // 获取用户信息
    getUserInfoData() {
      this.getUserInfo(() => {
        this.$alert("用户未登录,请登录?", "提示", {
          confirmButtonText: "确定",
          callback: action => {
            this.$router.push("/login");
          }
        });
      });
    },
    // 返回
    backFn() {
      this.$router.back();
    }
  },
  components: {
    Upload
  }
};
</script>

<style lang="less" scoped>
.header {
  padding: 20px 50px;
  margin: 1px 1px 0px 1px;
  border: 1px solid #ebebeb;
}
.content {
  padding: 20px 100px;
  margin: 0 1px 1px 1px;
  border: 1px solid #ebebeb;
}
.upload {
  display: inline-block;
  //   border-radius: 50%;
  //   overflow: hidden;
}
/deep/.el-input {
  width: 30%;
}
</style>