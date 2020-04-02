<template>
  <view>
    <QSTextarea
      :name="formName"
      variableName="tapClear"
      title="一键清除"
      required
      v-model="values.tapClear"
      :itemDisabled="itemDisabled"
    ></QSTextarea>

    <QSTextarea
      layout="column"
      :name="formName"
      variableName="password"
      password
      title="密码"
      v-model="values.password"
      :itemDisabled="itemDisabled"
    ></QSTextarea>

    <QSTextarea
      :name="formName"
      variableName="leftIcon"
      title="左边自定义图标"
      leftIcon="chat"
      v-model="values.leftIcon"
      :itemDisabled="itemDisabled"
    ></QSTextarea>

    <QSTextarea
      :name="formName"
      variableName="customTapIcon"
      title="右边点击图标"
      customTapIcon="scan"
      v-model="values.customTapIcon"
      :itemDisabled="itemDisabled"
    ></QSTextarea>

    <QSTextarea
      :name="formName"
      variableName="rightButtonTex"
      title="右边点击按钮"
      rightButtonTex="扫码"
      v-model="values.rightButtonTex"
    ></QSTextarea>

    <QSTextarea
      :name="formName"
      variableName="phoneNum"
      title="手机号"
      leftIcon="phone"
      verifyType="Tel"
      v-model="values.phoneNum"
      :itemDisabled="itemDisabled"
    ></QSTextarea>

    <QSTextarea
      ref="code"
      :name="formName"
      variableName="code"
      title="验证码"
      ifCode
      v-model="values.code"
      :phoneNum="values.phoneNum"
    ></QSTextarea>

    <QSTextarea
      :name="formName"
      variableName="filter"
      title="限制一位小数"
      v-model="values.filter"
      filterType="twoDecimalPlaces"
      :itemDisabled="itemDisabled"
      :phoneNum="values.phoneNum"
    ></QSTextarea>

    <button type="primary" style="margin-top: 50rpx;" @tap="getData">
      获取输入
    </button>
    <button type="primary" style="margin-top: 50rpx;" @tap="setItemDisabled">
      禁用input
    </button>
  </view>
</template>

<script>
import QSApp from "@/components/QS-inputs-split/js/app.js";
export default {
  data() {
    return {
      title: "Hello",
      formName: "input",
      values: {
        tapClear: "沃恩扫过他就能顺口溜进那个客人了十几年的",
        password: "",
        leftIcon: "",
        customTapIcon: "",
        rightButtonTex: "",
        phoneNum: "",
        code: "",
        filter: "",
      },
      itemDisabled: false,
    };
  },
  methods: {
    getData() {
      console.log(JSON.stringify(this.values));
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
    reSet() {
      this.values = {
        tapClear: "",
        password: "",
        leftIcon: "",
        customTapIcon: "",
        rightButtonTex: "",
        phoneNum: "",
        code: "",
        filter: "",
      };
    },
    go() {
      uni.navigateTo({
        url: "../test/test",
      });
    },
    setItemDisabled() {
      this.itemDisabled = !this.itemDisabled;
    },
  },
};
</script>

<style></style>
