<template>
  <view>
    <QSwitch
      title="switch"
      name="switch"
      variableName="switch"
      v-model="value"
    ></QSwitch>
    <button type="primary" @tap="getForm()" style="margin-top: 50rpx;">
      获取数据
    </button>
  </view>
</template>

<script>
import QSApp from "@/components/QS-inputs-split/js/app.js";
export default {
  data() {
    return {
      value: true,
    };
  },
  methods: {
    getForm() {
      QSApp.getForm("switch")
        .then((res) => {
          console.log(`获取数据成功: ${JSON.stringify(res)}`);
          uni.showToast({ title: "获取数据成功" });
        })
        .catch((err) => {
          console.log(`获取数据异常: ${JSON.stringify(err)}`);
          uni.showToast({ title: "获取数据异常" });
        });
    },
  },
};
</script>

<style></style>
