import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import { tool } from "../assets/js/tool.js";
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: {},
  },
  mutations: {
    setUserInfo(state, playload) {
      state.userInfo = playload.data;
    }
  },
  actions: {
    getUserInfo(context,callback) {
      axios({
          method: "GET",
          url: "/userInfo"
        })
        .then(result => {
          console.log(result);
          if (result.data.code == 1060) {
            // 头像链接拼接
            result.data.result[0].createdAt = tool.formatDate(
              new Date(result.data.result[0].createdAt),
              "yyyy-MM-dd hh:mm:ss"
            );
            context.commit('setUserInfo', {
              data: result.data.result[0]
            })
          }
        })
        .catch(err => {
          console.log(err)
          if(err){
            callback();
          }
        });
    }
  },
  modules: {}
})