<template>
  <div class="app" id="app">
    <router-view></router-view>
  </div>
</template>

<script>


export default {
  name: "app",
  components: {

  }
};
</script>

<style lang="less">
// 全局样式

body {
  background-color: #f7f7f7;
}

.fl {
  float: left;
}

.fr {
  float: right;
}

.clearfix::after {
  display: block;
  content: "";
  clear: both;
}

.auto-img {
  width: 100%;
  display: block;
}

.app{
  min-width: 1170px;
}
</style>>

