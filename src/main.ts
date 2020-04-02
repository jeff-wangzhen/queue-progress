import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import * as utils from "./common/js/common";
import Request from "./common/js/pocky-request v.2.0.4/index";
Vue.component("cu-custom", cuCustom);
// Vue.use(EventBus);
// var bus = new EventBus.Bus();
Vue.prototype.$store = store;
Vue.prototype.$utils = utils;

import cuCustom from "./colorui/components/cu-custom.vue";
Vue.component("cu-custom", cuCustom);

const tui = {
  toast: function(text: string, duration: number, success: boolean) {
    uni.showToast({
      title: text,
      icon: success ? "success" : "none",
      duration: duration || 2000,
    });
  },
  constNum: function() {
    const res: any = uni.getSystemInfoSync();
    return res.platform.toLocaleLowerCase() == "android" ? 300 : 0;
  },
  px: function(num: number) {
    return uni.upx2px(num) + "px";
  },
  interfaceUrl: function() {
    //接口地址
    return "https://www.thorui.cn";
  },
  setToken: function(token: string) {
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
Vue.prototype.$eventHub = Vue.prototype.$eventHub || new Vue();
Vue.prototype.$http = Request();
Vue.prototype.$isDark = false;
Vue.prototype.CustomBar = 0;
Vue.config.productionTip = false;
const a = new App();
console.log(a);
// a.$mount();
new Vue({
  // bus,
  store,
  render: (h: any) => h(App),
}).$mount();
