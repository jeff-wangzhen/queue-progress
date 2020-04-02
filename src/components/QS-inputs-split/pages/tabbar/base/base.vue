<template>
  <view class="defaultFontSize">
    <textView :content="content" />
    <itemList :itemList="items" />
  </view>
</template>

<script>
export default {
  data() {
    return {
      content: "本组件目前支持\r\ninput",
      items: [
        {
          name: "完整Demo",
          path: "/pages/basics/basicsDemo/basicsDemo",
        },
        {
          name: "input-输入框",
          path: "/pages/basics/QS-input/QS-input",
        },
        {
          name: "radio-单选框",
          path: "/pages/basics/QS-radio/QS-radio",
        },
        {
          name: "checkbox-复选框",
          path: "/pages/basics/QS-checkbox/QS-checkbox",
        },
        {
          name: "textarea-多行文本框",
          path: "/pages/basics/QS-textarea/QS-textarea",
        },
        {
          name: "picker-date-日期选择",
          path: "/pages/basics/QS-picker-date/QS-picker-date",
        },
        {
          name: "picker-city-城市选择",
          path: "/pages/basics/QS-picker-city/QS-picker-city",
        },
        {
          name: "picker-custom-自定义选择",
          path: "/pages/basics/QS-picker-custom/QS-picker-custom",
        },
        {
          name: "picker-custom2-自定义选择2",
          path: "/pages/basics/QS-picker-custom2/QS-picker-custom2",
        },
        {
          name: "pics-上传图片",
          path: "/pages/basics/QS-pics/QS-pics",
        },
        {
          name: "infinitePics-无限上传图片",
          path: "/pages/basics/QS-infinitePics/QS-infinitePics",
        },
        {
          name: "switch",
          path: "/pages/basics/QS-switch/QS-switch",
        },
      ],
    };
  },
};
</script>

<style></style>
