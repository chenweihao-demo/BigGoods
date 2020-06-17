<template>
  <div class="register">
    <div class="form-box">
      <h3 class="title-text">BigGoods平台</h3>
      <el-form ref="form" label-position="left" :model="userInfo" label-width="80px">
        <!-- 邮箱 -->
        <el-form-item label="邮箱">
          <el-input placeholder="请输入邮箱" v-model="userInfo.email"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item label="密码">
          <el-input placeholder="请输入密码" v-model="userInfo.password" show-password></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item>
          <el-button type="primary" class="btn-mystyle" @click="login">登录</el-button>
          <div class="clearfix login-text">
            <span class="fl" @click="goRegister">没有账号，立即注册</span>
            <span class="fr">找回密码</span>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
//导入表单验证文件
import { validForm } from "../assets/js/validForm";
export default {
  name: "Login",
  data() {
    return {
      userInfo: {
        email: "",
        password: ""
      }
    };
  },
  methods: {
    login() {
      //表单验证
      let result = validForm.valid(this.userInfo);
      if (result.pass === false) {
        this.$message({
          message: result.msg,
          duration: 3000
        });
        return;
      }

      //发起登录请求
      this.axios({
        method: "POST",
        url: "/login",
        data: this.userInfo
      })
        .then(result => {
          
          if (result.data.code == 1020) {
            this.$cookies.set("_abc", result.data.token, "5d");
            this.$router.push({ name: "Type" });
          } else {
            this.$message({
              message: result.data.msg,
              duration: 3000
            });
          }
        })
        .catch(err => {
          
        });
    },

    //跳转到注册
    goRegister() {
      this.$router.push({ name: "Register" });
    }
  }
};
</script>

<style lang="less" scoped>
.register {
  width: 100%;
  height: 100vh;
  background-image: url("../assets/register_bg1.jpg");
}
.form-box {
  width: 400px;
  //   height: 340px;
  border-radius: 5px;
  background-color: #ffffff;
  position: fixed;
  top: 150px;
  right: 300px;
  padding: 20px 20px 0 20px;
  box-shadow: 3px 3px 10px 2px rgba(0, 0, 0, 0.3);
}
.title-text{
  text-align: center;
  font-size: 26px;
  padding-bottom: 20px;
}
.btn-mystyle {
  width: 100%;
}
.login-text {
  margin-top: 10px;
  color: #444;
  cursor: pointer;
  // margin-left: 80px;
}
</style>