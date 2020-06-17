<template>
  <div class="register">
    <div class="form-box">
      <h3 class="title-text">BigGoods平台</h3>
      <el-form ref="form" label-position="left" :model="userInfo" label-width="80px">
        <!-- 邮箱 -->
        <el-form-item label="邮箱">
          <el-input placeholder="请输入邮箱" v-model="userInfo.email"></el-input>
        </el-form-item>
        <!-- 昵称 -->
        <el-form-item label="昵称">
          <el-input placeholder="请输入昵称" v-model="userInfo.nickname"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item label="密码">
          <el-input placeholder="请输入密码" v-model="userInfo.password" show-password></el-input>
        </el-form-item>
        <!-- 邮箱验证 -->
        <el-form-item label="验证码">
          <el-input placeholder="请输入验证码" v-model="userInfo.code">
            <el-button slot="append" type="info" plain :disabled="isSend" @click="getCode">{{text}}</el-button>
          </el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item>
          <el-button type="primary" class="btn-mystyle" @click="register">注册</el-button>
          <div class="clearfix login-text">
            <span class="fr" @click="goLogin">已有账号，立即登录</span>
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
  name: "Register",
  data() {
    return {
      userInfo: {
        email: "",
        nickname: "",
        password: "",
        code: ""
      },
      text: "发送验证码",
      isSend: false
    };
  },
  methods: {
    //获取邮箱验证码
    getCode() {
      //验证邮箱格式是否正确
      let data = { email: this.userInfo.email };
      let res = validForm.valid(data);
      if (res.pass === false) {
        this.$message({
          message: res.msg,
          duration: 3000
        });

        return;
      }

      let time = 60;
      this.text = `${time}s后重新发送`;
      this.isSend = true;
      let timer = setInterval(() => {
        if (time == 0) {
          clearInterval(timer);
          timer = null;
          this.text = `发送邮箱验证`;
          this.isSend = false;
        } else {
          time--;
          this.text = `${time}s后重新发送`;
          this.isSend = true;
        }
      }, 1000);
      //发送邮箱验证码
      this.axios({
        method: "POST",
        url: "/sendmail",
        data
      })
        .then(result => {
          this.$message({
            message: result.data.msg,
            duration: 3000
          });
        })
        .catch(err => {});
    },
    //注册
    register() {
      //表单验证
      let result = validForm.valid(this.userInfo);
      if (result.pass === false) {
        this.$message({
          message: result.msg,
          duration: 3000
        });
        return;
      }

      //发起注册请求
      this.axios({
        method: "POST",
        url: "http://127.0.0.1:8002/register",
        data: this.userInfo
      })
        .then(result => {
          if (result.data.code == 1000) {
            this.goLogin();
          } else {
            this.$message({
              message: result.data.msg,
              duration: 3000
            });
          }
        })
        .catch(err => {});
    },
    //跳转登录
    goLogin() {
      this.$router.push({ name: "Login" });
     
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
  // height: 340px;
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
}
</style>