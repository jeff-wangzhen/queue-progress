<template>
  <view>
    <block v-for="(item, index) in items" :key="index">
      <QSRadio
        :name="formName"
        :variableName="item.variableName"
        :value="item.value"
        :required="item.required"
        :title="item.title"
        :layout="item.layout"
        :itemArray="item.itemArray"
        :contentLayout="item.contentLayout"
        :color="item.color"
        :scale="item.scale"
        :itemDisabled="itemDisabled"
      ></QSRadio>
    </block>
    <button type="primary" @tap="getForm()" style="margin-top: 50rpx;">
      获取数据
    </button>
    <button type="primary" @tap="setItemDisabled()" style="margin-top: 10rpx;">
      禁用
    </button>
  </view>
</template>

<script>
import QSApp from "@/components/QS-inputs-split/js/app.js";
export default {
  data() {
    return {
      itemDisabled: false,
      formName: "radio",
      items: [
        {
          title: "性别",
          color: "#adadad",
          variableName: "sex",
          required: true,
          itemArray: [
            {
              name: "男",
              value: "男",
            },
            {
              name: "女",
              value: "女",
            },
          ],
          value: "女",
          layout: "column",
        },
        {
          title: "账户类型",
          color: "#f5105c",
          variableName: "countType",
          contentLayout: "left",
          itemArray: [
            {
              name: "对公",
              value: "对公",
            },
            {
              name: "对私",
              value: "对私",
            },
          ],
        },
        {
          title: "喜欢运动吗?",
          color: "#99ff00",
          variableName: "likeSport",
          contentLayout: "center",
          scale: ".5",
          itemArray: [
            {
              name: "喜欢",
              value: "喜欢",
            },
            {
              name: "不喜欢",
              value: "不喜欢",
            },
          ],
        },
      ],
    };
  },
  methods: {
    getForm() {
      QSApp.getForm(this.formName)
        .then((res) => {
          console.log(`获取数据成功: ${JSON.stringify(res)}`);
          uni.showToast({ title: "获取数据成功" });
        })
        .catch((err) => {
          console.log(`获取数据异常: ${JSON.stringify(err)}`);
          uni.showToast({ title: "获取数据异常" });
        });
    },
    setItemDisabled() {
      this.itemDisabled = !this.itemDisabled;
    },
  },
};
</script>

<style></style>
