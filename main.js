import Vue from 'vue'
import App from './App'
import * as utils from "./common/js/common";

import cuCustom from './colorui/components/cu-custom.vue'

import store from "./store";
import {
  getQueueList,
  setUser
} from './common/js/common.js'

Vue.component('cu-custom', cuCustom)


const tui = {
  toast: function(text, duration, success) {
    uni.showToast({
      title: text,
      icon: success ? "success" : "none",
      duration: duration || 2000,
    });
  },
  constNum: function() {
    const res = uni.getSystemInfoSync();
    return res.platform.toLocaleLowerCase() == "android" ? 300 : 0;
  },
  px: function(num) {
    return uni.upx2px(num) + "px";
  },
  interfaceUrl: function() {
    //接口地址
    return "https://www.thorui.cn";
  },
  setToken: function(token) {
    uni.setStorageSync("token", token);
  },
  getToken() {
    return uni.getStorageSync("token");
  },
  isLogin: function() {
    return uni.getStorageSync("token") ? true : false;
  },
  webURL: function() {
    return "https://www.thorui.cn/wx";
  },
};

Vue.prototype.tui = tui;
Vue.prototype.$store = store;
Vue.prototype.$utils = utils;
Vue.prototype.$getQueueList = getQueueList;
Vue.prototype.$setUser = setUser;
Vue.prototype.CustomBar = 0;
Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()
