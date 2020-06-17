import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import './plugins/element.js'
import axios from 'axios'
import VueAxios from 'vue-axios'

import VueCookies from 'vue-cookies'

import 'echarts/theme/macarons.js'
//导入font-awesome图标库
import 'font-awesome/css/font-awesome.min.css'

Vue.config.productionTip = false

Vue.use(VueCookies)
Vue.use(VueAxios, axios);
Vue.prototype.staticUrl = 'http://127.0.0.1:8002'

//设置基础请求路径http://127.0.0.1:8002   http://localhost:8080/api
axios.defaults.baseURL = '';

//设置post请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

// 携带cookie
axios.defaults.withCredentials = true;

//添加axios请求拦截器, 该方法在请求之前触发
axios.interceptors.request.use(params => {
  // console.log('params ==> ', params);
  //对于post请求,需要将参数进行序列化
  if (params.method == 'post') {
    let str = '';
    for (let key in params.data) {
      str += key + '=' + params.data[key] + '&'
    }

    str = str.slice(0, -1);

    params.data = str;
  }
  return params;

})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')