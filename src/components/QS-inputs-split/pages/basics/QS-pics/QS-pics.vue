<template>
  <view>
    <QSPics
      ref="pics"
      name="pics"
      variableName="pics"
      title="上传图片"
      v-model="picsData"
    ></QSPics>
    <button type="primary" @tap="getPics">上传图片</button>
    <button type="primary" @tap="getForm">获取表单数据</button>
  </view>
</template>

<script>
import QSApp from "@/components/QS-inputs-split/js/app.js";
export default {
  data() {
    return {
      picsData: [
        { title: "测试", required: true },
        { title: "测试2", required: true },
      ],
    };
  },
  methods: {
    getPics() {
      const upLoadPromiseArray = this.$refs.pics.getUpLoadPromiseArray();
      if (upLoadPromiseArray)
        upLoadPromiseArray
          .then((res) => {
            console.log("上传图片成功:" + JSON.stringify(res));
          })
          .catch((err) => {
            console.log("上传图片失败:" + JSON.stringify(err));
          });
    },
    getForm() {
      QSApp.getForm("pics")
        .then((res) => {
          console.log("获取输入成功" + JSON.stringify(res));
        })
        .catch((err) => {
          console.log("获取输入失败" + JSON.stringify(err));
        });
    },
  },
};
</script>

<style scoped>
button {
  margin: 10rpx;
}
</style>
