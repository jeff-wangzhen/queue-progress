<template>
  <view>
    <block v-for="(item, index) in items" :key="index">
      <QSCheckbox
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
      ></QSCheckbox>
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
      formName: "checkbox",
      items: [
        {
          title: "你喜欢什么电影?",
          color: "#adadad",
          variableName: "movie",
          required: true,
          itemArray: [
            {
              name: "哈利波特",
              value: "哈利波特",
              color: "#f5105c",
            },
            {
              name: "魔戒",
              value: "魔戒",
              color: "#888",
            },
            {
              name: "玩具总动员",
              value: "玩具总动员",
            },
            {
              name: "硬核亨利",
              value: "硬核亨利",
            },
          ],
          value: ["哈利波特", "硬核亨利"],
          layout: "column",
        },
        {
          title: "你喜欢吃哪些菜?",
          color: "#f5105c",
          variableName: "greens",
          contentLayout: "left",
          itemArray: [
            {
              name: "猪肉",
              value: "猪肉",
            },
            {
              name: "青菜",
              value: "青菜",
            },
            {
              name: "西红柿",
              value: "西红柿",
            },
          ],
          value: ["猪肉"],
        },
        {
          title: "喜欢的运动有?",
          color: "#99ff00",
          variableName: "sports",
          contentLayout: "center",
          scale: ".5",
          itemArray: [
            {
              name: "跑步",
              value: "跑步",
            },
            {
              name: "滑雪",
              value: "滑雪",
            },
            {
              name: "冲浪",
              value: "冲浪",
            },
          ],
          value: ["滑雪", "冲浪"],
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
