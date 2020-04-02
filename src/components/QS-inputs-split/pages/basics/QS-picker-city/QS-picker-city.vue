<template>
  <view>
    <QSPickerCity
      :name="formName"
      variableName="city"
      title="城市"
      :value="city"
      placherhold="请选择"
    />
    <button type="primary" style="margin-top: 50rpx;" @tap="getData">
      获取输入
    </button>
  </view>
</template>

<script>
import QSApp from "@/components/QS-inputs-split/js/app.js";
export default {
  data() {
    return {
      formName: "picker_city",
      city: {},
    };
  },
  methods: {
    getData() {
      QSApp.getForm(this.formName)
        .then((res) => {
          console.log("获取FORM数据成功: " + JSON.stringify(res));
          uni.showToast({ title: "获取数据成功" });
          this.reSet();
        })
        .catch((err) => {
          console.log("获取FORM数据失败: " + JSON.stringify(err));
          uni.showToast({ title: "获取数据异常" });
        });
    },
    go() {
      uni.navigateTo({
        url: "../test/test",
      });
    },
  },
};
</script>

<style></style>
