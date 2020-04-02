<template>
  <view>
    <QSInput
      :name="formName"
      variableName="tapClear"
      title="一键清除"
      required
      v-model="values.tapClear"
      :itemDisabled="itemDisabled"
    ></QSInput>

    <QSInput
      layout="column"
      :name="formName"
      variableName="password"
      password
      title="密码"
      v-model="values.password"
      :itemDisabled="itemDisabled"
    ></QSInput>

    <QSInput
      :name="formName"
      variableName="leftIcon"
      title="左边自定义图标"
      leftIcon="chat"
      v-model="values.leftIcon"
      :itemDisabled="itemDisabled"
    ></QSInput>

    <QSInput
      :name="formName"
      variableName="customTapIcon"
      title="右边点击图标"
      customTapIcon="scan"
      v-model="values.customTapIcon"
      :itemDisabled="itemDisabled"
    ></QSInput>

    <QSInput
      :name="formName"
      variableName="rightButtonTex"
      title="右边点击按钮"
      rightButtonTex="扫码"
      v-model="values.rightButtonTex"
    ></QSInput>

    <QSInput
      :name="formName"
      variableName="phoneNum"
      title="手机号"
      leftIcon="phone"
      verifyType="Tel"
      v-model="values.phoneNum"
      :itemDisabled="itemDisabled"
    ></QSInput>

    <QSInput
      ref="code"
      :name="formName"
      variableName="code"
      title="验证码"
      ifCode
      v-model="values.code"
      :phoneNum="values.phoneNum"
      checkPhoneNum
      @getCode="getCode"
    ></QSInput>

    <QSInput
      :name="formName"
      variableName="filter"
      title="限制一位小数"
      v-model="values.filter"
      filterType="twoDecimalPlaces"
      :itemDisabled="itemDisabled"
      :phoneNum="values.phoneNum"
    ></QSInput>

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
        tapClear: "撒浪嘿呦~",
        password: "",
        leftIcon: "",
        customTapIcon: "",
        rightButtonTex: "",
        phoneNum: "",
        code: "",
        filter: "",
      },
      itemDisabled: false,
      nCode: "",
    };
  },
  methods: {
    getCode() {
      this.nCode = QSApp.sendSMS(this.values.phoneNum);
      console.log("nCode-Type:" + typeof this.nCode);
      this.$refs.code.startCode();
    },
    getData() {
      if (!this.nCode) {
        QSApp.showToast("请先获取验证码");
        return;
      }
      QSApp.getForm(this.formName)
        .then((res) => {
          console.log("获取输入:" + JSON.stringify(res));
          console.log("nCode:" + this.nCode);
          console.log("nCode-Type:" + typeof this.nCode);
          console.log("code-Type:" + typeof res.data.code);
          console.log("对比验证码:" + (res.data.code === this.nCode));
          if (res.data.code !== this.nCode) {
            QSApp.showToast("验证码错误");
            return;
          }
          console.log("获取FORM数据成功: " + JSON.stringify(res));
          QSApp.showToast("获取数据成功", "success");
          this.reSet();
        })
        .catch((err) => {
          console.log("获取FORM数据失败: " + JSON.stringify(err));
          QSApp.showToast("获取数据异常");
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
