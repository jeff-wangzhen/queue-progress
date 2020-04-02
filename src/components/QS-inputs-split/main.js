import Vue from "vue";
import App from "./App";
import textView from "./components/textView.vue";
import itemList from "./components/itemList.vue";
Vue.component("textView", textView);
Vue.component("itemList", itemList);

/* 全局注册QS-inputs-split组件 */
import QSInput from "./components/QS-inputs-split/elements/QS-input/index.vue";
import QSRadio from "./components/QS-inputs-split/elements/QS-radio/index.vue";
import QSCheckbox from "./components/QS-inputs-split/elements/QS-checkbox/index.vue";
import QSTextarea from "./components/QS-inputs-split/elements/QS-textarea/index.vue";
import QSPickerDate from "./components/QS-inputs-split/elements/QS-picker-date/index.vue";
import QSPickerCity from "./components/QS-inputs-split/elements/QS-picker-city/index.vue";
import QSPickerCustom from "./components/QS-inputs-split/elements/QS-picker-custom/index.vue";
import QSPickerCustom2 from "./components/QS-inputs-split/elements/QS-picker-custom2/index.vue";
import QSPics from "./components/QS-inputs-split/elements/QS-pics/index.vue";
import QSInfinitePics from "./components/QS-inputs-split/elements/QS-infinitePics/index.vue";
import QSwitch from "./components/QS-inputs-split/elements/QS-switch/index.vue";
Vue.component("QSInput", QSInput);
Vue.component("QSRadio", QSRadio);
Vue.component("QSCheckbox", QSCheckbox);
Vue.component("QSTextarea", QSTextarea);
Vue.component("QSPickerDate", QSPickerDate);
Vue.component("QSPickerCity", QSPickerCity);
Vue.component("QSPickerCustom", QSPickerCustom);
Vue.component("QSPickerCustom2", QSPickerCustom2);
Vue.component("QSPics", QSPics);
Vue.component("QSInfinitePics", QSInfinitePics);
Vue.component("QSwitch", QSwitch);
/*  结束 */
Vue.config.productionTip = false;

App.mpType = "app";

const app = new Vue({
  ...App,
});
app.$mount();
