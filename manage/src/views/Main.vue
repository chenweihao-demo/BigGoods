<template>
  <div class="main">
    <div class="header">
      <div class="fl title">BigGoods平台</div>
      <div class="fr clearfix">
        <div class="user-img fl">
          <img
            class="auto-img"
            v-if="userInfo.userImg"
            :src="staticUrl + '/' + userInfo.userImg"
            alt
          />
        </div>
        <div class="nickname fl">{{userInfo.nickname}}</div>
        <div class="fl setting" @click="setUserInfo">设置</div>
        <div class="fl logout" @click="signOut">退出</div>
      </div>
    </div>
    <div class="box">
      <div class="aside">
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          router
        >
          <el-submenu v-for="(item, index) in asideMenu" :key="index"  :index="index+1+''">
            <template slot="title">
              <i class="fa" :class="[item.icon]"></i>
              <span class="titleName">{{item.title}}</span>
            </template>
             <el-menu-item  v-for="(v, i) in item.subTitle"
              :key="i" :index="v.routerName">{{v.name}}</el-menu-item>
          </el-submenu>
        </el-menu>
      </div>
      <div class="content">
        <!-- 二级路由 -->
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import { tool } from "../assets/js/tool.js";
import { mapState, mapActions } from "vuex";
export default {
  name: "Main",
  data() {
    return {
      asideMenu: [
        {
          title: "商品管理",
          icon: "fa-cube",
          subTitle: [
            {
              name: "商品类型",
              //路由名称
              routerName: "Type"
            },
            {
              name: "商品列表",
              routerName: "Products"
            }
          ]
        },
        {
          title: "订单管理",
          icon: "fa-file-text-o",
          subTitle: [
            {
              name: "订单列表",
              routerName: "Order"
            }
          ]
        },
        {
          title: "数据统计",
          icon: "fa-bar-chart",
          subTitle: [
            {
              name: "商品统计",
              routerName: "ProductStatistics"
            },
            {
              name: "订单统计",
              routerName: "OrderStatistics"
            }
          ]
        }
      ]
    };
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo
    })
  },
  created() {
    //获取用户信息
    this.getUserInfo(() => {
      this.$alert("用户未登录,请登录?", "提示", {
        confirmButtonText: "确定",
        callback: action => {
          this.$router.push("/login");
        }
      });
    });
  },
  mounted() {},
  methods: {
    ...mapActions(["getUserInfo"]),
    
    // 设置个人信息
    setUserInfo() {
      if (this.$route.name == "User") return;
      this.$router.push({ name: "User", params: { user: this.userInfo } });
    },
    // 退出登录
    signOut() {
      this.$confirm("确定退出登录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$cookies.remove("_abc");
          this.$router.push("/login");
        })
        .catch(() => {});
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  }
};
</script>

<style lang="less" scoped>
.main {
  width: 100%;
  height: 100%;
  // 头部
  .header {
    height: 80px;
    background-color: #c0c4cc;
    position: sticky;
    top: 0;
    padding: 0 20px;
    z-index: 99;

    .user-img {
      width: 60px;
      height: 60px;
      margin-top: 10px;
      border-radius: 50%;
      background-color: #fff;
      overflow: hidden;
    }
    .nickname {
      margin-left: 20px;
      line-height: 80px;
    }
    .title {
      line-height: 80px;
      font-size: 24px;
    }
    .setting {
      line-height: 80px;
      margin: 0 20px;
      cursor: pointer;
    }
    .logout {
      line-height: 80px;
      cursor: pointer;
    }
  }

  .box {
    .aside {
      position: fixed;
      left: 0;
      top: 80px;
      bottom: 0;
      width: 200px;
      background-color: #545c64;
      .titleName {
        padding-left: 10px;
      }
      .type-item {
        height: 40px;
        line-height: 40px;
        color: #fff;
        padding-left: 30px;
        cursor: pointer;
        &.active {
          background-color: #5e5e5e;
        }
      }
    }
    .content {
      width: calc(100% - 200px);
      margin-left: 200px;
      background-color: #fff;
    }
  }
  /deep/.el-collapse-item__header {
    background-color: #555252;
    color: #fff;
    border-bottom: 1px solid #000;
    padding-left: 15px;
  }

  /deep/.el-collapse-item__wrap {
    background-color: transparent;
    border-bottom: 1px solid #000;
  }
  /deep/.el-collapse-item__content {
    padding-bottom: 0px;
  }
}
</style>